import { Shipment } from "../data/shipments";

export interface DashboardFilters {
  mode: string;
  riskLevel: string;
  carrier: string;
}

export const getFilteredShipments = (shipments: Shipment[], filters: DashboardFilters) => {
  return shipments.filter(s => {
    if (filters.mode && filters.mode !== 'All' && s.mode !== filters.mode) return false;
    if (filters.riskLevel && filters.riskLevel !== 'All' && s.riskLevel !== filters.riskLevel) return false;
    if (filters.carrier && filters.carrier !== 'All' && s.carrier !== filters.carrier) return false;
    return true;
  });
};

export const calculateKpis = (shipments: Shipment[]) => {
  const total = shipments.length;
  if (total === 0) return { total: 0, delayRate: 0, avgDelay: 0, totalCost: 0, criticalCount: 0, avgCo2: 0 };
  
  const delayed = shipments.filter(s => s.delayDays > 0);
  const critical = shipments.filter(s => s.riskLevel === 'Critical');
  const validDelays = shipments.filter(s => s.delayDays > 0).map(s => s.delayDays);
  const avgDelay = validDelays.length > 0 ? validDelays.reduce((a, b) => a + b, 0) / validDelays.length : 0;
  const totalCost = shipments.reduce((sum, s) => sum + s.costEur, 0);
  const avgCo2 = shipments.reduce((sum, s) => sum + s.co2Kg, 0) / total;

  return {
    total,
    delayRate: delayed.length / total,
    avgDelay,
    totalCost,
    criticalCount: critical.length,
    avgCo2
  };
};

export const getCarrierPerformance = (shipments: Shipment[]) => {
  const carriers = new Map<string, Shipment[]>();
  
  shipments.forEach(s => {
    if (s.carrier && s.carrier !== "Unknown Carrier" && s.carrier.trim() !== '') {
      const c = s.carrier;
      if (!carriers.has(c)) carriers.set(c, []);
      carriers.get(c)!.push(s);
    }
  });

  const performance = Array.from(carriers.entries()).map(([name, shps]) => {
    const total = shps.length;
    const delayed = shps.filter(s => s.delayDays > 0).length;
    const critical = shps.filter(s => s.riskLevel === 'Critical' || s.riskLevel === 'High').length;
    const delayRate = delayed / total;
    const criticalRatio = critical / total;
    
    const delays = shps.filter(s => s.delayDays > 0).map(s => s.delayDays);
    const avgDelay = delays.length > 0 ? delays.reduce((a,b) => a+b,0) / delays.length : 0;
    
    const totalCost = shps.reduce((sum, s) => sum + s.costEur, 0);
    const avgCost = totalCost / total;

    let score = 100 - (delayRate * 40) - (avgDelay * 5) - (criticalRatio * 30);
    score = Math.max(0, Math.min(100, Math.round(score)));

    let rating = 'Good';
    if (total < 3) {
      rating = 'Insufficient';
    } else if (score < 50) {
      rating = 'Risky';
    } else if (score < 70) {
      rating = 'Watch';
    } else {
      rating = 'Good';
    }

    return {
      name,
      total,
      delayRate,
      avgDelay,
      totalCost,
      avgCost,
      criticalCount: critical,
      score,
      rating
    };
  });

  return performance.sort((a, b) => b.score - a.score);
};

export const getDiagnostic = (shipments: Shipment[]) => {
  const perf = getCarrierPerformance(shipments).filter(p => p.rating !== 'Insufficient');
  const delayMode = getDelayReasons(shipments)[0]?.name || 'Unknown';
  const kpis = calculateKpis(shipments);
  
  return {
    isDelayHigh: kpis.delayRate > 0.3,
    delayRate: (kpis.delayRate * 100).toFixed(1),
    delayMode,
    bestCarrier: perf[0]?.name || null
  };
};

export const getCriticalRoutes = (shipments: Shipment[]) => {
  const routes = new Map<string, Shipment[]>();
  
  shipments.forEach(s => {
    const routeId = `${s.originCity} -> ${s.destinationCity}`;
    if (!routes.has(routeId)) routes.set(routeId, []);
    routes.get(routeId)!.push(s);
  });

  const metrics = Array.from(routes.entries()).map(([name, shps]) => {
    const total = shps.length;
    const delays = shps.filter(s => s.delayDays > 0).map(s => s.delayDays);
    const avgDelay = delays.length > 0 ? delays.reduce((a,b) => a+b,0) / delays.length : 0;
    const delayRate = delays.length / total;
    const totalCost = shps.reduce((sum, s) => sum + s.costEur, 0);
    const critical = shps.filter(s => s.riskLevel === 'Critical' || s.riskLevel === 'High').length;
    
    const modes = shps.map(s => s.mode);
    const dominantMode = modes.sort((a,b) =>
          modes.filter(v => v===a).length
        - modes.filter(v => v===b).length
    ).pop()!;

    const criticalityScore = Math.min(100, (delayRate * 40) + ((critical / total) * 40) + (Math.min(avgDelay, 10) * 2));

    return {
      name,
      total,
      avgDelay,
      totalCost,
      delayRate,
      criticalCount: critical,
      dominantMode,
      criticalityScore
    };
  });

  return metrics.sort((a, b) => b.criticalityScore - a.criticalityScore).slice(0, 10);
};

export const getDelayReasons = (shipments: Shipment[]) => {
  const reasons = new Map<string, number>();
  
  shipments.filter(s => s.delayDays > 0).forEach(s => {
    reasons.set(s.delayReason, (reasons.get(s.delayReason) || 0) + 1);
  });

  return Array.from(reasons.entries())
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);
};

export const getShipmentsByMode = (shipments: Shipment[]) => {
  const modes = new Map<string, number>();
  shipments.forEach(s => {
    modes.set(s.mode, (modes.get(s.mode) || 0) + 1);
  });
  return Array.from(modes.entries()).map(([name, value]) => ({ name, value }));
};

export const getCostByMode = (shipments: Shipment[]) => {
  const modes = new Map<string, number>();
  shipments.forEach(s => {
    modes.set(s.mode, (modes.get(s.mode) || 0) + s.costEur);
  });
  return Array.from(modes.entries()).map(([name, value]) => ({ name, value }));
};

export const calculateDataQuality = (shipments: Shipment[]) => {
  let issuesCount = 0;
  const anomalies: Array<{ id: string, type: string, severity: string, recommendation: string }> = [];

  const tFlag = (flag: string) => {
    switch(flag) {
      case 'Duplicate id': return 'Identifiant dupliqué';
      case 'Missing actual arrival': return 'Date d’arrivée réelle manquante';
      case 'Missing carrier': return 'Transporteur manquant';
      case 'Abnormal transport cost': return 'Coût transport anormal';
      case 'Invalid weight': return 'Poids invalide';
      case 'Negative delay': return 'Retard négatif';
      default: return flag;
    }
  };

  shipments.forEach(s => {
    let hasIssue = false;
    if (s.dataQualityFlag) {
      anomalies.push({
        id: s.id,
        type: tFlag(s.dataQualityFlag),
        severity: 'Élevée',
        recommendation: 'Vérification manuelle requise (alerte explicite)'
      });
      hasIssue = true;
    }
    if (!s.carrier || s.carrier === "Unknown Carrier") {
      anomalies.push({ id: s.id, type: 'Transporteur manquant', severity: 'Moyenne', recommendation: 'Mettre à jour le TMS avec le transporteur' });
      hasIssue = true;
    }
    if (s.costEur > 12000) {
      anomalies.push({ id: s.id, type: 'Coût transport anormal', severity: 'Moyenne', recommendation: 'Vérifier le montant de la facture' });
      hasIssue = true;
    }
    if (s.costEur < 0) {
      anomalies.push({ id: s.id, type: 'Coût invalide', severity: 'Moyenne', recommendation: 'Corriger dans la base de données' });
      hasIssue = true;
    }
    if (s.weightKg <= 0) {
      anomalies.push({ id: s.id, type: 'Poids invalide', severity: 'Critique', recommendation: 'Demander la pesée au HUB' });
      hasIssue = true;
    }
    if (s.delayDays < 0) {
      anomalies.push({ id: s.id, type: 'Retard négatif', severity: 'Élevée', recommendation: 'Vérifier les dates d\'arrivée prévues et réelles' });
      hasIssue = true;
    }
    if (isNaN(s.originLat) || isNaN(s.originLng) || isNaN(s.destinationLat) || isNaN(s.destinationLng) || s.originLat === 0 || s.destinationLat === 0) {
      anomalies.push({ id: s.id, type: 'Coordonnées GPS invalides', severity: 'Élevée', recommendation: 'Vérifier les points d\'origine et destination' });
      hasIssue = true;
    }
    if (!s.plannedDeparture || !s.plannedArrival || s.plannedDeparture === 'Invalid Date' || s.plannedArrival === 'Invalid Date') {
      anomalies.push({ id: s.id, type: 'Date invalide', severity: 'Élevée', recommendation: 'Vérifier les dates de transport' });
      hasIssue = true;
    }

    if (hasIssue) issuesCount++;
  });

  const dupCheck = new Set();
  shipments.forEach(s => {
    if (dupCheck.has(s.id)) {
      if (!anomalies.find(a => a.id === s.id && a.type === 'Identifiant dupliqué')) {
         anomalies.push({ id: s.id, type: 'Identifiant dupliqué', severity: 'Élevée', recommendation: 'Fusionner ou supprimer le doublon' });
         issuesCount++;
      }
    }
    dupCheck.add(s.id);
  });

  const total = shipments.length;
  
  // Deduplicate anomalies by id + type
  const uniqueAnomalies = Array.from(new Map(anomalies.map(a => [`${a.id}-${a.type}`, a])).values());
  
  const score = total > 0 ? Math.max(0, 100 - ((issuesCount / total) * 100)) : 100;

  return {
    score: Math.round(score),
    totalRows: total,
    anomalies: uniqueAnomalies
  };
};

export const runOptimizationScenario = (shipments: Shipment[]) => {
  const perf = getCarrierPerformance(shipments).filter(p => p.rating !== 'Insufficient');
  if (perf.length < 2) return null;
  
  const worst = perf[perf.length - 1];
  const best = perf[0];
  
  const affectedShipments = shipments.filter(s => s.carrier === worst.name && (s.riskLevel === 'High' || s.riskLevel === 'Critical'));
  const originalDelays = affectedShipments.reduce((sum, s) => sum + s.delayDays, 0);
  
  // Simulate 25% reduction in these delays
  const savedDays = Math.round(originalDelays * 0.25);
  
  // Rough cost per day of delay (e.g., 200 EUR)
  const savedCost = savedDays * 200;

  return {
    worstCarrier: worst.name,
    bestCarrier: best.name,
    affectedCount: affectedShipments.length,
    savedDays,
    savedCost,
    worstCurrentDelayRate: worst.delayRate,
    worstSimulatedDelayRate: worst.delayRate * 0.75, // 25% improvement
    worstSimulatedDelayDays: Math.max(0, worst.avgDelay - (savedDays / Math.max(1, affectedShipments.length)))
  };
}
