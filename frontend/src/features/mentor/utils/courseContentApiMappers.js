import {
  resolveDocSourceType,
  resolveVideoSourceType,
  filterLearningMaterials,
  getMaterialPersistentId,
  pathHasAnyDirty,
  trimShortDescription,
  toPathIsActiveValue,
  withNormalizedOrders,
} from './mentorCourseContentUtils';

function parsePathSnapshot(snapshot) {
  if (!snapshot) return null;
  try {
    return JSON.parse(snapshot);
  } catch {
    return null;
  }
}

function normalizePathFields(path = {}) {
  return {
    PathName: String(path.PathName ?? '').trim(),
    Description: trimShortDescription(path.Description),
    IsActive: toPathIsActiveValue(path.IsActive ?? path.isActive, 1),
  };
}

function normalizeNodeFields(node = {}) {
  return {
    NodeName: String(node.NodeName ?? node.nodeName ?? '').trim(),
    Description: trimShortDescription(node.Description),
    IsActive: toPathIsActiveValue(node.IsActive ?? node.isActive, 1),
  };
}

function buildMaterialApiData(material = {}) {
  const base = {
    MaterialType: material.MaterialType,
    Title: String(material.Title ?? '').trim(),
    MaterialOrder: Number(material.MaterialOrder ?? 1),
  };

  if (material.MaterialType === 'TEXT') {
    return {
      ...base,
      SourceType: material.SourceType ?? 'UPLOAD',
      MaterialUrl: String(material.MaterialUrl ?? '').trim() || null,
      FileName: material.FileName ?? null,
      FileSize: material.FileSize ?? null,
    };
  }

  if (material.MaterialType === 'DOC') {
    const sourceType = resolveDocSourceType(material);
    return {
      ...base,
      SourceType: sourceType,
      MaterialUrl: String(material.MaterialUrl ?? '').trim() || null,
      FileName: material.FileName ?? null,
      FileSize: material.FileSize ?? null,
    };
  }

  if (material.MaterialType === 'VIDEO') {
    const sourceType = resolveVideoSourceType(material);
    return {
      ...base,
      SourceType: sourceType,
      MaterialUrl: String(material.MaterialUrl ?? '').trim() || null,
      FileName: material.FileName ?? null,
      FileSize: material.FileSize ?? null,
    };
  }

  return {
    ...base,
    MaterialUrl: String(material.MaterialUrl ?? '').trim() || null,
  };
}

function buildMaterialContentSet(current = {}, baseline = {}) {
  const set = {};
  const currentData = buildMaterialApiData(current);
  const baselineData = buildMaterialApiData(baseline);

  Object.keys(currentData).forEach((key) => {
    if (key === 'MaterialOrder') return;
    if (JSON.stringify(currentData[key]) !== JSON.stringify(baselineData[key])) {
      set[key] = currentData[key];
    }
  });

  return set;
}

function buildNodeUpdateSet(current = {}, baseline = {}) {
  const set = {};
  const currentFields = normalizeNodeFields(current);
  const baselineFields = normalizeNodeFields(baseline);

  if (currentFields.NodeName !== baselineFields.NodeName) {
    set.NodeName = currentFields.NodeName;
  }
  if (currentFields.Description !== baselineFields.Description) {
    set.Description = currentFields.Description;
  }
  if (currentFields.IsActive !== baselineFields.IsActive || Object.keys(baseline).length === 0) {
    set.IsActive = currentFields.IsActive;
  }

  return set;
}

function buildPathUpdateSet(current = {}, baseline = {}, pathOrder = null) {
  const set = {};
  const currentFields = normalizePathFields(current);
  const baselineFields = normalizePathFields(baseline);

  if (currentFields.PathName !== baselineFields.PathName) {
    set.PathName = currentFields.PathName;
  }
  if (currentFields.Description !== baselineFields.Description) {
    set.Description = currentFields.Description;
  }
  if (currentFields.IsActive !== baselineFields.IsActive || Object.keys(baseline).length === 0) {
    set.IsActive = currentFields.IsActive;
  }
  if (pathOrder != null && Number(pathOrder) !== Number(baseline?.Order ?? baseline?.PathOrder ?? pathOrder)) {
    set.Order = Number(pathOrder);
  }

  return set;
}

function diffNodeMaterials(currentNode, baselineNode, nodeId, payload) {
  const baselineMaterials = filterLearningMaterials(baselineNode?.materials ?? baselineNode?.Materials ?? []);
  const currentMaterials = filterLearningMaterials(currentNode?.materials ?? currentNode?.Materials ?? []);
  const currentMaterialIds = new Set(
    currentMaterials
      .map((item) => getMaterialPersistentId(item))
      .filter(Boolean),
  );

  baselineMaterials.forEach((material) => {
    const materialId = getMaterialPersistentId(material);
    if (materialId && !currentMaterialIds.has(materialId)) {
      payload.materialsDelete.push({ materialId, nodeId });
      payload.summary.materialsDelete += 1;
    }
  });

  currentMaterials.forEach((material, materialIndex) => {
    const materialOrder = materialIndex + 1;
    const materialId = getMaterialPersistentId(material);
    if (!materialId) {
      payload.materialsInsert.push({
        nodeId,
        clientRef: material.tempId,
        MaterialOrder: materialOrder,
        data: buildMaterialApiData({ ...material, MaterialOrder: materialOrder }),
      });
      payload.summary.materialsInsert += 1;
      return;
    }

    const baselineMaterial = baselineMaterials.find(
      (item) => getMaterialPersistentId(item) === materialId,
    ) ?? baselineMaterials.find((item) => item.tempId === material.tempId);
    const materialSet = buildMaterialContentSet(
      { ...material, MaterialId: materialId, MaterialOrder: materialOrder },
      baselineMaterial ?? {},
    );
    const orderChanged = materialOrder !== Number(baselineMaterial?.MaterialOrder ?? materialOrder);

    if (Object.keys(materialSet).length > 0 || orderChanged) {
      payload.materialsUpdate.push({
        materialId,
        nodeId,
        ...(Object.keys(materialSet).length > 0 ? { set: materialSet } : {}),
        ...(orderChanged ? { MaterialOrder: materialOrder } : {}),
      });
      payload.summary.materialsUpdate += 1;
    }
  });
}

export function buildCoursePathSavePayload(
  path,
  { courseId, pathOrder },
  baselineSnapshot = null,
) {
  const [normalizedPath] = withNormalizedOrders([path]);
  const baseline = parsePathSnapshot(baselineSnapshot);
  const pathId = normalizedPath.PathId ?? null;
  const currentNodes = normalizedPath.nodes ?? [];
  const baselineNodes = baseline?.nodes ?? [];

  const payload = {
    context: {
      courseId: Number(courseId) || null,
      pathId,
      pathOrder: Number(pathOrder) || 1,
      pathTempId: normalizedPath.tempId ?? null,
      pathName: normalizePathFields(normalizedPath).PathName || null,
    },
    summary: {
      pathInsert: 0,
      pathUpdate: 0,
      nodesInsert: 0,
      nodesUpdate: 0,
      nodesDelete: 0,
      materialsInsert: 0,
      materialsUpdate: 0,
      materialsDelete: 0,
    },
    pathInsert: null,
    pathUpdate: null,
    nodesInsert: [],
    nodesUpdate: [],
    nodesDelete: [],
    materialsInsert: [],
    materialsUpdate: [],
    materialsDelete: [],
  };

  if (!pathId) {
    payload.pathInsert = {
      table: 'Paths',
      data: {
        ...normalizePathFields(normalizedPath),
        Order: payload.context.pathOrder,
      },
      nodes: currentNodes.map((node, nodeIndex) => ({
        table: 'Path_Nodes',
        clientRef: node.tempId,
        NodeOrder: nodeIndex + 1,
        data: {
          ...normalizeNodeFields(node),
          NodeOrder: nodeIndex + 1,
        },
        materialsInsert: filterLearningMaterials(node.materials ?? []).map((material, materialIndex) => ({
          table: 'Node_Materials',
          clientRef: material.tempId,
          MaterialOrder: materialIndex + 1,
          data: buildMaterialApiData({ ...material, MaterialOrder: materialIndex + 1 }),
        })),
      })),
    };
    payload.summary.pathInsert = 1;
    payload.summary.nodesInsert = currentNodes.length;
    payload.summary.materialsInsert = currentNodes.reduce(
      (sum, node) => sum + filterLearningMaterials(node.materials ?? []).length,
      0,
    );
    return payload;
  }

  const pathSet = buildPathUpdateSet(normalizedPath, baseline ?? {}, payload.context.pathOrder);
  if (Object.keys(pathSet).length > 0) {
    payload.pathUpdate = {
      table: 'Paths',
      pathId,
      set: pathSet,
    };
    payload.summary.pathUpdate = 1;
  }

  const currentNodeIds = new Set(
    currentNodes.filter((node) => node.NodeId).map((node) => node.NodeId),
  );

  baselineNodes.forEach((node) => {
    if (node.NodeId && !currentNodeIds.has(node.NodeId)) {
      payload.nodesDelete.push({ table: 'Path_Nodes', nodeId: node.NodeId });
      payload.summary.nodesDelete += 1;
    }
  });

  currentNodes.forEach((node, nodeIndex) => {
    const nodeOrder = nodeIndex + 1;

    if (!node.NodeId) {
      payload.nodesInsert.push({
        table: 'Path_Nodes',
        pathId,
        clientRef: node.tempId,
        NodeOrder: nodeOrder,
        data: {
          ...normalizeNodeFields(node),
          NodeOrder: nodeOrder,
        },
        materialsInsert: filterLearningMaterials(node.materials ?? []).map((material, materialIndex) => ({
          table: 'Node_Materials',
          clientRef: material.tempId,
          MaterialOrder: materialIndex + 1,
          data: buildMaterialApiData({ ...material, MaterialOrder: materialIndex + 1 }),
        })),
      });
      payload.summary.nodesInsert += 1;
      payload.summary.materialsInsert += filterLearningMaterials(node.materials ?? []).length;
      return;
    }

    const baselineNode = baselineNodes.find((item) => item.NodeId === node.NodeId)
      ?? baselineNodes.find((item) => item.tempId === node.tempId);
    const nodeSet = buildNodeUpdateSet(node, baselineNode ?? {});
    const nodeOrderChanged = nodeOrder !== Number(baselineNode?.NodeOrder ?? nodeOrder);

    if (Object.keys(nodeSet).length > 0 || nodeOrderChanged) {
      payload.nodesUpdate.push({
        table: 'Path_Nodes',
        nodeId: node.NodeId,
        ...(Object.keys(nodeSet).length > 0 ? { set: nodeSet } : {}),
        ...(nodeOrderChanged ? { NodeOrder: nodeOrder } : {}),
      });
      payload.summary.nodesUpdate += 1;
    }

    diffNodeMaterials(node, baselineNode ?? {}, node.NodeId, payload);
  });

  return payload;
}

export function hasCoursePathSaveOperations(payload = {}) {
  return Boolean(
    payload.pathInsert
    || payload.pathUpdate
    || (payload.nodesInsert?.length ?? 0) > 0
    || (payload.nodesUpdate?.length ?? 0) > 0
    || (payload.nodesDelete?.length ?? 0) > 0
    || (payload.materialsInsert?.length ?? 0) > 0
    || (payload.materialsUpdate?.length ?? 0) > 0
    || (payload.materialsDelete?.length ?? 0) > 0,
  );
}

function emptyCoursePathSavePayload(context = {}) {
  return {
    context,
    summary: {
      pathInsert: 0,
      pathUpdate: 0,
      nodesInsert: 0,
      nodesUpdate: 0,
      nodesDelete: 0,
      materialsInsert: 0,
      materialsUpdate: 0,
      materialsDelete: 0,
    },
    pathInsert: null,
    pathUpdate: null,
    nodesInsert: [],
    nodesUpdate: [],
    nodesDelete: [],
    materialsInsert: [],
    materialsUpdate: [],
    materialsDelete: [],
  };
}

export function buildCoursePathOnlySavePayload(
  path,
  { courseId, pathOrder },
  baselineSnapshot = null,
) {
  const [normalizedPath] = withNormalizedOrders([path]);
  const baseline = parsePathSnapshot(baselineSnapshot);
  const pathId = normalizedPath.PathId ?? null;

  const payload = {
    context: {
      courseId: Number(courseId) || null,
      pathId,
      pathOrder: Number(pathOrder) || 1,
      pathTempId: normalizedPath.tempId ?? null,
      pathName: normalizePathFields(normalizedPath).PathName || null,
    },
    summary: {
      pathInsert: 0,
      pathUpdate: 0,
      nodesInsert: 0,
      nodesUpdate: 0,
      nodesDelete: 0,
      materialsInsert: 0,
      materialsUpdate: 0,
      materialsDelete: 0,
    },
    pathInsert: null,
    pathUpdate: null,
    nodesInsert: [],
    nodesUpdate: [],
    nodesDelete: [],
    materialsInsert: [],
    materialsUpdate: [],
    materialsDelete: [],
  };

  if (!pathId) {
    payload.pathInsert = {
      table: 'Paths',
      data: {
        ...normalizePathFields(normalizedPath),
        Order: payload.context.pathOrder,
      },
    };
    payload.summary.pathInsert = 1;
    return payload;
  }

  const pathSet = buildPathUpdateSet(normalizedPath, baseline ?? {}, payload.context.pathOrder);
  if (Object.keys(pathSet).length > 0) {
    payload.pathUpdate = {
      table: 'Paths',
      pathId,
      set: pathSet,
    };
    payload.summary.pathUpdate = 1;
  }

  return payload;
}

export function buildCourseNodeSavePayload(
  path,
  nodeTempId,
  { courseId, pathOrder },
  baselineSnapshot = null,
) {
  const fullPayload = buildCoursePathSavePayload(
    path,
    { courseId, pathOrder },
    baselineSnapshot,
  );
  const node = (path.nodes ?? path.Nodes ?? []).find((item) => item.tempId === nodeTempId);
  if (!node) {
    return emptyCoursePathSavePayload(fullPayload.context ?? {});
  }

  const nodeId = node.NodeId ?? null;
  const nodesInsert = (fullPayload.nodesInsert ?? []).filter(
    (item) => item.clientRef === nodeTempId,
  );
  const nodesUpdate = (fullPayload.nodesUpdate ?? []).filter(
    (item) => item.nodeId === nodeId,
  );
  const materialsInsert = (fullPayload.materialsInsert ?? []).filter(
    (item) => item.nodeId === nodeId,
  );
  const materialsUpdate = (fullPayload.materialsUpdate ?? []).filter(
    (item) => item.nodeId === nodeId,
  );
  const materialsDelete = (fullPayload.materialsDelete ?? []).filter(
    (item) => item.nodeId === nodeId,
  );

  const nestedMaterialsInsert = nodesInsert.reduce(
    (sum, item) => sum + (item.materialsInsert?.length ?? 0),
    0,
  );

  return {
    context: {
      ...(fullPayload.context ?? {}),
      nodeTempId,
      nodeId,
      nodeName: normalizeNodeFields(node).NodeName || null,
    },
    summary: {
      pathInsert: 0,
      pathUpdate: 0,
      nodesInsert: nodesInsert.length,
      nodesUpdate: nodesUpdate.length,
      nodesDelete: 0,
      materialsInsert: materialsInsert.length + nestedMaterialsInsert,
      materialsUpdate: materialsUpdate.length,
      materialsDelete: materialsDelete.length,
    },
    pathInsert: null,
    pathUpdate: null,
    nodesInsert,
    nodesUpdate,
    nodesDelete: [],
    materialsInsert,
    materialsUpdate,
    materialsDelete,
  };
}

export function hasCoursePathOnlySaveOperations(payload = {}) {
  return Boolean(payload.pathInsert || payload.pathUpdate);
}

export function buildCoursePathUnpublishOnlyPayload(
  path,
  { courseId, pathOrder },
) {
  const pathId = path?.PathId ?? null;
  const emptySummary = {
    pathInsert: 0,
    pathUpdate: 0,
    nodesInsert: 0,
    nodesUpdate: 0,
    nodesDelete: 0,
    materialsInsert: 0,
    materialsUpdate: 0,
    materialsDelete: 0,
  };

  if (!pathId) {
    return {
      context: {
        courseId: Number(courseId) || null,
        pathId: null,
        pathOrder: Number(pathOrder) || 1,
        pathTempId: path?.tempId ?? null,
        pathName: normalizePathFields(path ?? {}).PathName || null,
      },
      summary: emptySummary,
      pathInsert: null,
      pathUpdate: null,
      nodesInsert: [],
      nodesUpdate: [],
      nodesDelete: [],
      materialsInsert: [],
      materialsUpdate: [],
      materialsDelete: [],
    };
  }

  return {
    context: {
      courseId: Number(courseId) || null,
      pathId,
      pathOrder: Number(pathOrder) || 1,
      pathTempId: path?.tempId ?? null,
      pathName: normalizePathFields(path ?? {}).PathName || null,
    },
    summary: { ...emptySummary, pathUpdate: 1 },
    pathInsert: null,
    pathUpdate: {
      table: 'Paths',
      pathId,
      set: { IsActive: 0 },
    },
    nodesInsert: [],
    nodesUpdate: [],
    nodesDelete: [],
    materialsInsert: [],
    materialsUpdate: [],
    materialsDelete: [],
  };
}

export function buildCourseNodeOnlySavePayload(
  path,
  nodeTempId,
  { courseId, pathOrder },
  baselineSnapshot = null,
) {
  const [normalizedPath] = withNormalizedOrders([path]);
  const baseline = parsePathSnapshot(baselineSnapshot);
  const baselineNodes = baseline?.nodes ?? [];
  const node = (normalizedPath.nodes ?? []).find((item) => item.tempId === nodeTempId);

  const payload = {
    context: {
      courseId: Number(courseId) || null,
      pathId: normalizedPath.PathId ?? null,
      pathOrder: Number(pathOrder) || 1,
      pathTempId: normalizedPath.tempId ?? null,
      pathName: normalizePathFields(normalizedPath).PathName || null,
      nodeTempId,
      nodeId: node?.NodeId ?? null,
      nodeName: node ? (normalizeNodeFields(node).NodeName || null) : null,
    },
    summary: {
      pathInsert: 0,
      pathUpdate: 0,
      nodesInsert: 0,
      nodesUpdate: 0,
      nodesDelete: 0,
      materialsInsert: 0,
      materialsUpdate: 0,
      materialsDelete: 0,
    },
    pathInsert: null,
    pathUpdate: null,
    nodesInsert: [],
    nodesUpdate: [],
    nodesDelete: [],
    materialsInsert: [],
    materialsUpdate: [],
    materialsDelete: [],
  };

  if (!node) return payload;

  const nodeIndex = (normalizedPath.nodes ?? []).findIndex((item) => item.tempId === nodeTempId);
  const nodeOrder = nodeIndex >= 0 ? nodeIndex + 1 : 1;
  const baselineNode = baselineNodes.find((item) => item.NodeId === node.NodeId)
    ?? baselineNodes.find((item) => item.tempId === nodeTempId);

  if (!node.NodeId) {
    if (!normalizedPath.PathId) return payload;
    payload.nodesInsert.push({
      table: 'Path_Nodes',
      pathId: normalizedPath.PathId,
      clientRef: nodeTempId,
      NodeOrder: nodeOrder,
      data: {
        ...normalizeNodeFields(node),
        NodeOrder: nodeOrder,
      },
      materialsInsert: [],
    });
    payload.summary.nodesInsert = 1;
    return payload;
  }

  const nodeSet = buildNodeUpdateSet(node, baselineNode ?? {});
  const nodeOrderChanged = nodeOrder !== Number(baselineNode?.NodeOrder ?? nodeOrder);
  if (Object.keys(nodeSet).length > 0 || nodeOrderChanged) {
    payload.nodesUpdate.push({
      table: 'Path_Nodes',
      nodeId: node.NodeId,
      ...(Object.keys(nodeSet).length > 0 ? { set: nodeSet } : {}),
      ...(nodeOrderChanged ? { NodeOrder: nodeOrder } : {}),
    });
    payload.summary.nodesUpdate = 1;
  }

  return payload;
}

export function buildCourseMaterialSavePayload(
  path,
  nodeTempId,
  materialTempId,
  { courseId, pathOrder },
  baselineSnapshot = null,
) {
  const [normalizedPath] = withNormalizedOrders([path]);
  const baseline = parsePathSnapshot(baselineSnapshot);
  const node = (normalizedPath.nodes ?? path.Nodes ?? []).find((item) => item.tempId === nodeTempId);
  if (!node) {
    return emptyCoursePathSavePayload({
      courseId: Number(courseId) || null,
      pathId: normalizedPath.PathId ?? null,
      pathOrder: Number(pathOrder) || 1,
      pathTempId: normalizedPath.tempId ?? null,
    });
  }

  const materials = filterLearningMaterials(node.materials ?? node.Materials ?? []);
  const materialIndex = materials.findIndex((item) => item.tempId === materialTempId);
  const material = materialIndex >= 0 ? materials[materialIndex] : null;
  if (!material) {
    return emptyCoursePathSavePayload({
      courseId: Number(courseId) || null,
      pathId: normalizedPath.PathId ?? null,
      pathOrder: Number(pathOrder) || 1,
      pathTempId: normalizedPath.tempId ?? null,
      nodeTempId,
      nodeId: node.NodeId ?? null,
    });
  }

  const nodeId = node.NodeId ?? null;
  const materialOrder = materialIndex + 1;
  const materialId = getMaterialPersistentId(material);
  const baselineNode = (baseline?.nodes ?? []).find((item) => item.NodeId === node.NodeId)
    ?? (baseline?.nodes ?? []).find((item) => item.tempId === nodeTempId);
  const baselineMaterials = filterLearningMaterials(baselineNode?.materials ?? baselineNode?.Materials ?? []);
  const baselineMaterial = baselineMaterials.find((item) => getMaterialPersistentId(item) === materialId)
    ?? baselineMaterials.find((item) => item.tempId === materialTempId);

  const payload = {
    context: {
      courseId: Number(courseId) || null,
      pathId: normalizedPath.PathId ?? null,
      pathOrder: Number(pathOrder) || 1,
      pathTempId: normalizedPath.tempId ?? null,
      pathName: normalizePathFields(normalizedPath).PathName || null,
      nodeTempId,
      nodeId,
      nodeName: normalizeNodeFields(node).NodeName || null,
      materialTempId,
      materialId,
      materialTitle: String(material.Title ?? '').trim() || null,
    },
    summary: {
      pathInsert: 0,
      pathUpdate: 0,
      nodesInsert: 0,
      nodesUpdate: 0,
      nodesDelete: 0,
      materialsInsert: 0,
      materialsUpdate: 0,
      materialsDelete: 0,
    },
    pathInsert: null,
    pathUpdate: null,
    nodesInsert: [],
    nodesUpdate: [],
    nodesDelete: [],
    materialsInsert: [],
    materialsUpdate: [],
    materialsDelete: [],
  };

  if (!nodeId) return payload;

  // Học liệu đã có ID → luôn UPDATE (PUT), không INSERT.
  if (!materialId) {
    payload.materialsInsert.push({
      nodeId,
      clientRef: materialTempId,
      MaterialOrder: materialOrder,
      data: buildMaterialApiData({ ...material, MaterialOrder: materialOrder }),
    });
    payload.summary.materialsInsert = 1;
    return payload;
  }

  const materialSet = buildMaterialContentSet(
    { ...material, MaterialId: materialId, MaterialOrder: materialOrder },
    baselineMaterial ?? {},
  );
  const orderChanged = materialOrder !== Number(
    baselineMaterial?.MaterialOrder ?? material.MaterialOrder ?? materialOrder,
  );

  if (Object.keys(materialSet).length > 0 || orderChanged) {
    payload.materialsUpdate.push({
      materialId,
      nodeId,
      ...(Object.keys(materialSet).length > 0 ? { set: materialSet } : {}),
      ...(orderChanged ? { MaterialOrder: materialOrder } : {}),
    });
    payload.summary.materialsUpdate = 1;
  }

  return payload;
}

export function hasCourseNodeOnlySaveOperations(payload = {}) {
  return Boolean(
    (payload.nodesInsert?.length ?? 0) > 0
    || (payload.nodesUpdate?.length ?? 0) > 0,
  );
}

export function hasCourseMaterialSaveOperations(payload = {}) {
  return Boolean(
    (payload.materialsInsert?.length ?? 0) > 0
    || (payload.materialsUpdate?.length ?? 0) > 0,
  );
}

export function hasCourseNodeSaveOperations(payload = {}) {
  return hasCourseNodeOnlySaveOperations(payload)
    || hasCourseMaterialSaveOperations(payload);
}

export function buildCoursePathApiCalls(payload = {}) {
  const calls = [];
  const ctx = payload.context ?? {};
  const courseId = ctx.courseId;
  const pathId = payload.pathUpdate?.pathId ?? ctx.pathId ?? null;

  (payload.materialsDelete ?? []).forEach((item) => {
    calls.push({
      method: 'DELETE',
      url: `/api/mentor/materials/${item.materialId}`,
      target: 'Node_Materials',
      id: item.materialId,
    });
  });

  (payload.nodesDelete ?? []).forEach((item) => {
    calls.push({
      method: 'DELETE',
      url: `/api/mentor/nodes/${item.nodeId}`,
      target: 'Path_Nodes',
      id: item.nodeId,
    });
  });

  if (payload.pathInsert) {
    calls.push({
      method: 'POST',
      url: `/api/mentor/courses/${courseId}/paths`,
      target: 'Paths',
      body: { data: payload.pathInsert.data },
    });

    (payload.pathInsert.nodes ?? []).forEach((node) => {
      calls.push({
        method: 'POST',
        url: `/api/mentor/paths/{pathId}/nodes`,
        target: 'Path_Nodes',
        body: {
          clientRef: node.clientRef ?? null,
          data: { ...node.data, NodeOrder: node.NodeOrder },
        },
        nestedMaterials: (node.materialsInsert ?? []).map((material) => ({
          method: 'POST',
          url: `/api/mentor/nodes/{nodeId}/materials`,
          target: 'Node_Materials',
          body: {
            clientRef: material.clientRef ?? null,
            data: material.data,
          },
        })),
      });
    });
  } else {
    if (payload.pathUpdate?.pathId) {
      calls.push({
        method: 'PUT',
        url: `/api/mentor/paths/${payload.pathUpdate.pathId}`,
        target: 'Paths',
        id: payload.pathUpdate.pathId,
        body: { set: payload.pathUpdate.set ?? {} },
      });
    }

    (payload.nodesUpdate ?? []).forEach((item) => {
      calls.push({
        method: 'PUT',
        url: `/api/mentor/nodes/${item.nodeId}`,
        target: 'Path_Nodes',
        id: item.nodeId,
        body: {
          ...(Object.keys(item.set ?? {}).length > 0 ? { set: item.set } : {}),
          ...(item.NodeOrder != null ? { order: item.NodeOrder } : {}),
        },
      });
    });

    (payload.nodesInsert ?? []).forEach((item) => {
      calls.push({
        method: 'POST',
        url: `/api/mentor/paths/${item.pathId ?? pathId}/nodes`,
        target: 'Path_Nodes',
        body: {
          clientRef: item.clientRef ?? null,
          data: { ...item.data, NodeOrder: item.NodeOrder },
        },
        nestedMaterials: (item.materialsInsert ?? []).map((material) => ({
          method: 'POST',
          url: `/api/mentor/nodes/{nodeId}/materials`,
          target: 'Node_Materials',
          body: {
            clientRef: material.clientRef ?? null,
            data: material.data,
          },
        })),
      });
    });

    (payload.materialsUpdate ?? []).forEach((item) => {
      calls.push({
        method: 'PUT',
        url: `/api/mentor/materials/${item.materialId}`,
        target: 'Node_Materials',
        id: item.materialId,
        body: {
          ...(Object.keys(item.set ?? {}).length > 0 ? { set: item.set } : {}),
          ...(item.MaterialOrder != null ? { order: item.MaterialOrder } : {}),
        },
      });
    });

    (payload.materialsInsert ?? []).forEach((item) => {
      calls.push({
        method: 'POST',
        url: `/api/mentor/nodes/${item.nodeId}/materials`,
        target: 'Node_Materials',
        body: {
          clientRef: item.clientRef ?? null,
          data: item.data,
        },
      });
    });
  }

  return calls;
}

export function compactCoursePathSavePayload(payload = {}) {
  if (!payload || typeof payload !== 'object') return {};

  const compact = {
    context: payload.context ?? {},
    summary: payload.summary ?? {},
  };

  if (payload.pathInsert) compact.pathInsert = payload.pathInsert;
  if (payload.pathUpdate) compact.pathUpdate = payload.pathUpdate;
  if ((payload.nodesInsert?.length ?? 0) > 0) compact.nodesInsert = payload.nodesInsert;
  if ((payload.nodesUpdate?.length ?? 0) > 0) compact.nodesUpdate = payload.nodesUpdate;
  if ((payload.nodesDelete?.length ?? 0) > 0) compact.nodesDelete = payload.nodesDelete;
  if ((payload.materialsInsert?.length ?? 0) > 0) compact.materialsInsert = payload.materialsInsert;
  if ((payload.materialsUpdate?.length ?? 0) > 0) compact.materialsUpdate = payload.materialsUpdate;
  if ((payload.materialsDelete?.length ?? 0) > 0) compact.materialsDelete = payload.materialsDelete;

  const apiCalls = buildCoursePathApiCalls(payload);
  if (apiCalls.length > 0) compact.apiCalls = apiCalls;

  return compact;
}

export function buildCoursePathSavePreviewPayload(
  courseId,
  paths = [],
  pathTempId,
  dirtyKeys = {},
) {
  const pathIndex = paths.findIndex((item) => item.tempId === pathTempId);
  const path = pathIndex >= 0 ? paths[pathIndex] : null;
  if (!path) return null;

  const payload = buildCoursePathOnlySavePayload(
    path,
    {
      courseId: Number(courseId),
      pathOrder: pathIndex + 1,
    },
    null,
  );

  const fullPayload = {
    ...payload,
    saveScope: 'path',
    context: {
      ...payload.context,
      api: 'REST PUT/POST /api/mentor/paths/:pathId',
    },
    summary: {
      ...payload.summary,
      otherUnsavedPaths: paths.filter(
        (item) => item.tempId !== pathTempId && pathHasAnyDirty(dirtyKeys, item.tempId),
      ).length,
    },
  };

  return {
    ...fullPayload,
    preview: compactCoursePathSavePayload(fullPayload),
  };
}

export function buildCourseNodeSavePreviewPayload(
  courseId,
  paths = [],
  pathTempId,
  nodeTempId,
  dirtyKeys = {},
) {
  const pathIndex = paths.findIndex((item) => item.tempId === pathTempId);
  const path = pathIndex >= 0 ? paths[pathIndex] : null;
  if (!path) return null;

  const payload = buildCourseNodeOnlySavePayload(
    path,
    nodeTempId,
    {
      courseId: Number(courseId),
      pathOrder: pathIndex + 1,
    },
    null,
  );

  const fullPayload = {
    ...payload,
    saveScope: 'node',
    context: {
      ...payload.context,
      api: 'REST PUT/POST /api/mentor/nodes/:nodeId',
    },
  };

  return {
    ...fullPayload,
    preview: compactCoursePathSavePayload(fullPayload),
  };
}

export function buildCourseMaterialSavePreviewPayload(
  courseId,
  paths = [],
  pathTempId,
  nodeTempId,
  materialTempId,
  dirtyKeys = {},
) {
  const pathIndex = paths.findIndex((item) => item.tempId === pathTempId);
  const path = pathIndex >= 0 ? paths[pathIndex] : null;
  if (!path) return null;

  const payload = buildCourseMaterialSavePayload(
    path,
    nodeTempId,
    materialTempId,
    {
      courseId: Number(courseId),
      pathOrder: pathIndex + 1,
    },
    null,
  );

  const fullPayload = {
    ...payload,
    saveScope: 'material',
    context: {
      ...payload.context,
      api: 'REST PUT/POST /api/mentor/materials/:materialId',
    },
  };

  return {
    ...fullPayload,
    preview: compactCoursePathSavePayload(fullPayload),
  };
}

export function applyCoursePathSaveResult(path, saveResult = {}) {
  const nodeIdMap = new Map((saveResult.nodeIdMap ?? []).map((item) => [item.clientRef, item.nodeId]));
  const materialIdMap = new Map(
    (saveResult.materialIdMap ?? []).map((item) => [item.clientRef, item.materialId]),
  );

  const nextPath = {
    ...path,
    PathId: saveResult.pathId ?? path.PathId ?? null,
    nodes: (path.nodes ?? []).map((node) => {
      const nextNode = {
        ...node,
        NodeId: nodeIdMap.get(node.tempId) ?? node.NodeId ?? null,
        materials: filterLearningMaterials(node.materials ?? []).map((material) => ({
          ...material,
          MaterialId: materialIdMap.get(material.tempId)
            ?? getMaterialPersistentId(material),
        })),
      };
      return nextNode;
    }),
  };

  return withNormalizedOrders([nextPath])[0];
}
