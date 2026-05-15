import type { StrategicOutput } from "@/features/strategic-output/types/StrategicOutput";
import type { Measure } from "@/features/measures/types/measureTypes";
import type { Indicator } from "@/features/indicator/types/indicatorTypes";

export interface KPATable{
    id_kpa: number;
    id_ck?: number;
    name: string;
    implementation: number;
    strategic_outputs_count: number;
    measures_count: number;
    indicators_count: number;
    // optional nested arrays when available or cached by the UI
    strategic_outputs?: StrategicOutput[];
    measures?: Measure[];
    indicators?: Indicator[];
}