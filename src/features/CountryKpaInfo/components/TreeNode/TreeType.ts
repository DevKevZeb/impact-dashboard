import type React from "react";
export interface IndicatorMeta {
  type?: string;
  type_id?: number;
  target?: number| string;
  //id?: number;
  //indicatorType?: string;
  //implementation?: number | string;
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
  parent_id?: number

  meta?: IndicatorMeta;
}
