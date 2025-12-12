// src/components/TreeNode/Tree.tsx
import React, { useState, useCallback } from "react";
import { ChevronRight, ChevronDown, Edit2, Trash2 } from "lucide-react";
import type { TreeNode } from "./TreeType";

interface LazyTreeProps {
  value: TreeNode[];
  selectionKey?: string | null;
  onSelectionChange?: (key: string | null, node: TreeNode | null) => void;
  loadChildren?: (nodeKey: string) => Promise<TreeNode[]>;
  onAddStrategicOutput?: (node: TreeNode) => void;
}

export const LazyTree: React.FC<LazyTreeProps> = ({ value, selectionKey, onSelectionChange, loadChildren, onAddStrategicOutput }) => {
  const [expandedKeys, setExpandedKeys] = useState<Record<string, boolean>>({});

  const findNode = useCallback(
    (key: string | null): TreeNode | null => {
      if (!key) return null;
      const stack = [...value];
      while (stack.length) {
        const n = stack.pop()!;
        if (n.key === key) return n;
        if (n.children) stack.push(...n.children);
      }
      return null;
    },
    [value]
  );

  const toggle = async (key: string) => {
    const node = findNode(key);
    if (!node) return;

    if (node.lazy && node.children === undefined && loadChildren) {
    console.log("Fetching children from backend:", node.key);

    node.loading = true;
    setExpandedKeys({ ...expandedKeys });

    try {
      node.children = await loadChildren(node.key);
    } finally {
      node.loading = false;
    }
  }

    setExpandedKeys(prev => ({ ...prev, [key]: !prev[key] }));
  };  

  const select = (node: TreeNode) => {
    if (!onSelectionChange || node.isTitle) return;
  };

  return (
    <ul className="tree-root">
      {value.map(n => (
        <Item key={n.key} node={n} level={0} expandedKeys={expandedKeys} onToggle={toggle} onSelect={select} selectedKey={selectionKey ?? null} onAddStrategicOutput={onAddStrategicOutput}/>
      ))}
    </ul>
  );
};

interface ItemProps {
  node: TreeNode;
  level: number;
  expandedKeys: Record<string, boolean>;
  onToggle: (key: string) => void;
  onSelect: (node: TreeNode) => void;
  selectedKey: string | null;
  onAddStrategicOutput?:(node: TreeNode) => void;
}

const Item: React.FC<ItemProps> = ({ node, level, expandedKeys, onToggle, onSelect, selectedKey, onAddStrategicOutput }) => {
  const expanded = !!expandedKeys[node.key];
  const isLeaf = node.leaf ?? false;
  const indent = (level * 1.75) + .5 + "rem";
  const isSelected = selectedKey === node.key;

  if (node.isTitle) {
    return (
      <li className="">
        <div className="pl-2 pt-3 pb-1 text-xs font-semibold text-slate-500 uppercase select-none" style={{ paddingLeft: indent }} >
          {node.label}
        </div>
      </li>
    );
  }

  return (
    <li className={`tree-node-group level-${node.data?.type}`}>
      <div className={`flex items-center gap-2 py-1 rounded-md cursor-pointer ${isSelected ? "bg-emerald-50" : "hover:bg-slate-50"}`} style={{ paddingLeft: indent }} onClick={() => onSelect(node)} >
        {node.data?.type != "i" && <button type="button" onClick={(e) => { e.stopPropagation(); onToggle(node.key);}} className="p-1 hover:bg-slate-200 rounded" >
          {expanded ? <ChevronDown className="w-4" /> : <ChevronRight className="w-4" />}
        </button>
        }

        {node.icon}

        <span className="font-medium text-sm">
          {node.label}
          {typeof node.data?.count === "number" && (
            <span className="ml-1 text-slate-500">
              ({node.data.count})
            </span>
          )}

          {node.data?.type === "i" && node.meta && (
            <div className="text-xs mt-2 text-slate-600 space-x-0.5">
              <p><strong>Type:</strong> {node.meta.indicatorType}</p>
              <p><strong>Target:</strong> {node.meta.target}</p>
              <p><strong>Implementation:</strong> {node.meta.implementation}</p>
            </div>
          )}
        </span>
        <div className="flex gap-1">
          {node.data?.type !== "country" && (
            <>
              <button type="button" onClick={(e) => { e.stopPropagation(); console.log("Edit", node); }} className="btn-edit-tree" >
                <Edit2 className="w-4" />
              </button>

              <button type="button" onClick={(e) => { e.stopPropagation(); console.log("Delete", node); }} className="btn-delete-tree" >
                <Trash2 className="w-4" />
              </button>
            </>
          )}

          {node.data?.type === "ck" && (
            <button type="button" onClick={(e) => {  onAddStrategicOutput?.(node); }} className="btn-tertiary text-xs" >
              + Strategic Output
            </button>
          )}
          {node.data?.type === "so" && (
            <button type="button" onClick={(e) => { e.stopPropagation(); console.log("Add ME", node); }} className="btn-tertiary text-xs" >
              + Measure
            </button>
          )}
          {node.data?.type === "m" && (
            <button type="button" onClick={(e) => { e.stopPropagation(); console.log("Add IN", node); }} className="btn-tertiary text-xs" >
              + Indicator
            </button>
          )}
        </div>
      </div>

      {!isLeaf && expanded && node.children && (
        <ul className={`tree-branch level-${node.data?.type}`}>
          {node.children.map(c => (
            <Item key={c.key} node={c} level={level + 1} expandedKeys={expandedKeys} onToggle={onToggle} onSelect={onSelect} selectedKey={selectedKey} onAddStrategicOutput={onAddStrategicOutput}/> ))}
        </ul>
      )}
    </li>
  );
};
