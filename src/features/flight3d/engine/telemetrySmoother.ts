import { lerpAngleDeg } from "../math/attitude";
import type { FlightTelemetry } from "../types";

export type SmoothedTelemetry = {
  lat: number;
  lng: number;
  headingDeg: number;
  pitchDeg: number;
  rollDeg: number;
};

export class TelemetrySmoother {
  lat: number;
  lng: number;
  headingDeg: number;
  pitchDeg: number;
  rollDeg: number;

  constructor(
    initial: FlightTelemetry,
    private readonly rates: { position: number; attitude: number }
  ) {
    this.lat = initial.lat;
    this.lng = initial.lng;
    this.headingDeg = initial.headingDeg;
    this.pitchDeg = initial.pitchDeg;
    this.rollDeg = initial.rollDeg;
  }

  step(target: FlightTelemetry): SmoothedTelemetry {
    this.lat += (target.lat - this.lat) * this.rates.position;
    this.lng += (target.lng - this.lng) * this.rates.position;
    this.headingDeg = lerpAngleDeg(this.headingDeg, target.headingDeg, this.rates.attitude);
    this.pitchDeg += (target.pitchDeg - this.pitchDeg) * this.rates.attitude;
    this.rollDeg += (target.rollDeg - this.rollDeg) * this.rates.attitude;
    return {
      lat: this.lat,
      lng: this.lng,
      headingDeg: this.headingDeg,
      pitchDeg: this.pitchDeg,
      rollDeg: this.rollDeg,
    };
  }
}
