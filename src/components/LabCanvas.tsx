import { useEffect, useRef } from 'react';
import { LabScene3D } from '../scene/LabScene3D';
import type { CameraMode, HotbarItem, StationId, VesselState } from '../types/chemistry';

export interface PourCommand {
  seq: number;
  targetVesselId: string;
  colorHex: string;
  sourceVesselId?: string;
}

export interface ExplosionCommand {
  seq: number;
  vesselId: string;
}

export interface WalkCommand {
  seq: number;
  station: Exclude<StationId, null>;
}

interface LabCanvasProps {
  vessels: VesselState[];
  selectedVesselId: string;
  cameraMode: CameraMode;
  activeHeldItem: HotbarItem;
  ownsExtinguisher: boolean;
  isSprayingExtinguisher: boolean;
  fireIntensity: number;
  burnedDown: boolean;
  pourCommand: PourCommand | null;
  explosionCommand: ExplosionCommand | null;
  walkCommand: WalkCommand | null;
  mobileMove: { forward: number; strafe: number };
  onSelectVessel: (vesselId: string) => void;
  onStationProximityChange: (station: StationId, distanceToFire: number) => void;
  onInteractStation3D: (station: StationId, reagentFormula?: string) => void;
}

export function LabCanvas({
  vessels,
  selectedVesselId,
  cameraMode,
  activeHeldItem,
  ownsExtinguisher,
  isSprayingExtinguisher,
  fireIntensity,
  burnedDown,
  pourCommand,
  explosionCommand,
  walkCommand,
  mobileMove,
  onSelectVessel,
  onStationProximityChange,
  onInteractStation3D,
}: LabCanvasProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const sceneRef = useRef<LabScene3D | null>(null);
  const callbacksRef = useRef({
    onSelectVessel,
    onStationProximityChange,
    onInteractStation3D,
  });

  useEffect(() => {
    callbacksRef.current = {
      onSelectVessel,
      onStationProximityChange,
      onInteractStation3D,
    };
  }, [onSelectVessel, onStationProximityChange, onInteractStation3D]);

  useEffect(() => {
    if (!containerRef.current) return;
    const lab = new LabScene3D(containerRef.current, {
      onSelectVessel: (id) => callbacksRef.current.onSelectVessel(id),
      onStationProximityChange: (st, dist) =>
        callbacksRef.current.onStationProximityChange(st, dist),
      onInteractStation3D: (st, formula) =>
        callbacksRef.current.onInteractStation3D(st, formula),
    });
    sceneRef.current = lab;
    return () => {
      lab.dispose();
      sceneRef.current = null;
    };
  }, []);

  useEffect(() => {
    sceneRef.current?.syncVessels(vessels);
  }, [vessels]);

  useEffect(() => {
    sceneRef.current?.setSelectedVessel(selectedVesselId);
  }, [selectedVesselId]);

  useEffect(() => {
    sceneRef.current?.setCameraMode(cameraMode);
  }, [cameraMode]);

  useEffect(() => {
    sceneRef.current?.syncHeldItem(activeHeldItem, ownsExtinguisher, isSprayingExtinguisher);
  }, [activeHeldItem, ownsExtinguisher, isSprayingExtinguisher, cameraMode]);

  useEffect(() => {
    sceneRef.current?.syncFireEmergency(fireIntensity, burnedDown);
  }, [fireIntensity, burnedDown]);

  useEffect(() => {
    sceneRef.current?.setMobileMove(mobileMove.forward, mobileMove.strafe);
  }, [mobileMove]);

  useEffect(() => {
    if (!pourCommand) return;
    sceneRef.current?.triggerPourAnimation(
      pourCommand.targetVesselId,
      pourCommand.colorHex,
      pourCommand.sourceVesselId
    );
  }, [pourCommand]);

  useEffect(() => {
    if (!explosionCommand) return;
    sceneRef.current?.triggerExplosion(explosionCommand.vesselId);
  }, [explosionCommand]);

  useEffect(() => {
    if (!walkCommand) return;
    sceneRef.current?.walkToStation(walkCommand.station);
  }, [walkCommand]);

  return <div id="lab-3d-viewport" ref={containerRef} className="lab-canvas-viewport" />;
}
