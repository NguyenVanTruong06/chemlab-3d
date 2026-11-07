import { useEffect, useRef } from 'react';
import { LabScene3D } from '../scene/LabScene3D';
import type { CameraMode, VesselState } from '../types/chemistry';

export interface PourCommand {
  seq: number;
  targetVesselId: string;
  colorHex: string;
  sourceVesselId?: string;
}

interface LabCanvasProps {
  vessels: VesselState[];
  selectedVesselId: string;
  cameraMode: CameraMode;
  pourCommand: PourCommand | null;
  mobileMove: { forward: number; strafe: number };
  onSelectVessel: (vesselId: string) => void;
  onSelectReagentFrom3D: (formula: string) => void;
  onNearWorkbenchChange: (isNear: boolean) => void;
}

export function LabCanvas({
  vessels,
  selectedVesselId,
  cameraMode,
  pourCommand,
  mobileMove,
  onSelectVessel,
  onSelectReagentFrom3D,
  onNearWorkbenchChange,
}: LabCanvasProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const sceneRef = useRef<LabScene3D | null>(null);
  const callbacksRef = useRef({
    onSelectVessel,
    onSelectReagentFrom3D,
    onNearWorkbenchChange,
  });

  useEffect(() => {
    callbacksRef.current = {
      onSelectVessel,
      onSelectReagentFrom3D,
      onNearWorkbenchChange,
    };
  }, [onSelectVessel, onSelectReagentFrom3D, onNearWorkbenchChange]);

  useEffect(() => {
    if (!containerRef.current) return;
    const lab = new LabScene3D(containerRef.current, {
      onSelectVessel: (id) => callbacksRef.current.onSelectVessel(id),
      onSelectReagentFrom3D: (formula) => callbacksRef.current.onSelectReagentFrom3D(formula),
      onNearWorkbenchChange: (near) => callbacksRef.current.onNearWorkbenchChange(near),
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

  return <div id="lab-3d-viewport" ref={containerRef} className="lab-canvas-viewport" />;
}
