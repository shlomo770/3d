import { useEffect, useRef } from "react";
import { useAppDispatch } from "../../shared/hooks/useAppDispatch";
import { useAppSelector } from "../../shared/hooks/useAppSelector";
import { normalizeTargetMessage } from "../../domain/normalizers";
import { upsertTarget } from "./targetsSlice";

export function TargetsSimulator() {
  const dispatch = useAppDispatch();
  const target = useAppSelector(s => s.targets.byId[s.targets.selectedId]);
  const tick = useRef(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      tick.current += 1;
      const t = tick.current;
      const heading = (target.headingDeg + 0.9) % 360;
      const rad = heading * Math.PI / 180;

      const msg = {
        name: "TARGET_POSITION",
        data: {
          id: target.id,
          callsign: target.callsign,
          type: target.type,
          group: target.group,
          lat: target.position.lat + Math.cos(rad) * 0.00007,
          lng: target.position.lng + Math.sin(rad) * 0.00007,
          alt: 2400 + Math.sin(t / 20) * 350,
          heading,
          pitch: -2 + Math.sin(t / 16) * 8,
          roll: Math.sin(t / 12) * 32,
          speed: 480 + Math.sin(t / 10) * 15,
          altitudeFt: 19019 + Math.sin(t / 20) * 900,
          climbRateFpm: 1120 + Math.sin(t / 14) * 220,
          groundSpeedKts: 475 + Math.sin(t / 11) * 15,
          verticalSpeedFpm: 1120 + Math.sin(t / 10) * 300
        }
      };

      const normalized = normalizeTargetMessage(msg, target);
      if (normalized) dispatch(upsertTarget(normalized));
    }, 190);

    return () => window.clearInterval(timer);
  }, [dispatch, target.id, target.position.lat, target.position.lng, target.headingDeg]);

  return null;
}
