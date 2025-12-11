import type React from "react";

export interface IndicatorMeta {
  indicatorType?: string;
  target?: number | string;
  implementation?: number | string;
}

export interface TreeNode<T = unknown> {
  key: string;
  label: string;
  icon?: React.ReactNode;
  children?: TreeNode<T>[];
  leaf?: boolean;
  selectable?: boolean;
  data?: {
    type: "country" | "ck" | "so" | "m" | "i";
    id: number;
    count?: number,
  };
  lazy?: boolean;
  loading?: boolean;
  isTitle?: boolean;

  meta?: IndicatorMeta;
}
