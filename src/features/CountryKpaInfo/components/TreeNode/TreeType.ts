import type React from "react";
export interface IndicatorMeta {
  type?: string;
  type_id?: number;
  target?: number| string;
}

export type NodeType = "country"|"ck"|"so"|"m"|"i"|"load-more";

export interface LoadMoreData {
  type: "load-more";
  parentType: "ck" | "so" | "m";
  parentId: number;
  nextPage: number;
}

export interface DefaultNodeData {
  type: "country" | "ck" | "so" | "m" | "i";
  id: number;
  count?: number;
}

export interface TreeNode<T = unknown> {
  key: string;
  label: string;
  icon?: React.ReactNode;
  children?: TreeNode<T>[];
  leaf?: boolean;
  selectable?: boolean;
  data?:DefaultNodeData | LoadMoreData;
  lazy?: boolean;
  loading?: boolean;
  isTitle?: boolean;
  parent_id?: number;
  meta?: IndicatorMeta;
}
