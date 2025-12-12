import React, { useState, useCallback, useEffect } from "react";
import { ChevronRight, ChevronDown, Edit2, Trash2 } from "lucide-react";
import type { TreeNode } from "./TreeType";

interface LazyTreeProps {
  value: TreeNode[];
  selectionKey?: string | null;
  onSelectionChange?: (key: string | null, node: TreeNode | null) => void;
  loadChildren?: (nodeKey: string) => Promise<TreeNode[]>;
  onAddStrategicOutput?: (node: TreeNode) => void;
  onEditStrategicOutput?: (node: TreeNode) => void;
  onDeleteStrategicOutput?: (node: TreeNode) => void;
  onAddMeasure?: (node: TreeNode) => void;
  onEditMeasure?: (node: TreeNode) => void;
  onDeleteMeasure?: (node: TreeNode) => void;
  onAddIndicator?: (node: TreeNode) => void;
  onEditIndicator?: (node: TreeNode) => void;
  onDeleteIndicator?: (node: TreeNode) => void;

  onRefreshNode?: (refreshFn: (key: string) => Promise<void>) => void;
}

export const LazyTree: React.FC<LazyTreeProps> = ({ value, selectionKey, onSelectionChange, loadChildren, onAddStrategicOutput, onEditStrategicOutput, onAddMeasure, onEditMeasure, onRefreshNode, onAddIndicator, onEditIndicator, onDeleteIndicator, onDeleteMeasure, onDeleteStrategicOutput }) => {

  const [internalValue, setInternalValue] = useState<TreeNode[]>(value);

  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  const [expandedKeys, setExpandedKeys] = useState<Record<string, boolean>>({});

  const findNode = useCallback(
    (key: string | null): TreeNode | null => {
      if (!key) return null;

      const stack = [...internalValue];
      while (stack.length) {
        const n = stack.pop()!;
        if (n.key === key) return n;
        if (n.children) stack.push(...n.children);
      }
      return null;
    },
    [internalValue]
  );

  const toggle = async (key: string) => {
    const node = findNode(key);
    if (!node) return;
    if (node.lazy && node.children === undefined && loadChildren) {
      node.loading = true;
      setExpandedKeys({ ...expandedKeys });
      try {
        node.children = await loadChildren(node.key);

        setInternalValue([...internalValue]);
      } finally {
        node.loading = false;
      }
    }

    setExpandedKeys(prev => ({ ...prev, [key]: !prev[key] }));
  };


  const select = (node: TreeNode) => {
    if (!onSelectionChange || node.isTitle) return;
    onSelectionChange(node.key, node);
  };

  const collapseChildren = (children: TreeNode[], expanded: Record<string, boolean>) => {
    const newKeys = { ...expanded };

    for (const child of children) {
      if (newKeys[child.key] !== undefined) delete newKeys[child.key];
      if (child.children) Object.assign(newKeys, collapseChildren(child.children, newKeys));
    }
    return newKeys;
  };



  const refreshNode = async (key: string) => {
    const node = findNode(key);
    if (!node || !loadChildren) return;

    node.children = undefined;
    node.loading = true;
    setInternalValue([...internalValue]);

    const children = await loadChildren(node.key);
    node.children = children;
    node.loading = false;
    setExpandedKeys(prev => {
      const collapsed = collapseChildren(children, prev);

      return { ...collapsed, [key]: true };
    });

    setInternalValue([...internalValue]);
  };

  useEffect(() => {
    if (onRefreshNode) onRefreshNode(refreshNode);
  }, [onRefreshNode, refreshNode]);


  return (
    <ul className="tree-root">
      {internalValue.map(n => (
        <Item key={n.key} node={n} level={0} expandedKeys={expandedKeys} onToggle={toggle} onSelect={select} selectedKey={selectionKey ?? null}
          onAddStrategicOutput={onAddStrategicOutput}
          onEditStrategicOutput={onEditStrategicOutput}
          onAddMeasure={onAddMeasure}
          onEditMeasure={onEditMeasure}
          onEditIndicator={onEditIndicator}
          onAddIndicator={onAddIndicator}
          onDeleteIndicator={onDeleteIndicator}
          onDeleteMeasure={onDeleteMeasure}
          onDeleteStrategicOutput={onDeleteStrategicOutput}
        />
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
  onEditStrategicOutput?: (node: TreeNode) => void;
  onAddMeasure?: (node: TreeNode) => void;
  onEditMeasure?: (node: TreeNode) => void;
  onAddIndicator?: (node: TreeNode) => void;
  onEditIndicator?: (node: TreeNode) => void;
  onDeleteStrategicOutput?: (node: TreeNode) => void;
  onDeleteMeasure?: (node: TreeNode) => void;
  onDeleteIndicator?: (node: TreeNode) => void;
}

const Item: React.FC<ItemProps> = ({ node, level, expandedKeys, onToggle, onSelect, selectedKey, onAddStrategicOutput, onEditStrategicOutput, onAddMeasure, onEditMeasure, onAddIndicator, onEditIndicator, onDeleteMeasure, onDeleteIndicator, onDeleteStrategicOutput }) => {

  const expanded = !!expandedKeys[node.key];
  const isLeaf = node.leaf ?? false;
  const indent = (level * 1.75) + .5 + "rem";
  const isSelected = selectedKey === node.key;


  const getActionButtons = (node: TreeNode) => {
    const type = node.data?.type;
    if (!type || type === "country" || node.isTitle) return null;
    if (type === "ck") {
      return (
        <button type="button" className="btn-tree" onClick={(e) => { e.stopPropagation(); onAddStrategicOutput?.(node); }} >
          + Strategic Output
        </button>
      );
    }

    const handleEdit = () => {
      switch (type) {
        case "so":
          onEditStrategicOutput?.(node);
          break;
        case "m":
          onEditMeasure?.(node);
          break;
        case "i":
          onEditIndicator?.(node);
          break;
      }
    };

    const handleDelete = () => {
      switch (type) {
        case "so":
          onDeleteStrategicOutput?.(node);
          break;
        case "m":
          onDeleteMeasure?.(node);
          break;
        case "i":
          onDeleteIndicator?.(node);
          break;  
      }
    };

    const extraAction = (() => {
      switch (type) {
        case "so":
          return (
            <button type="button" className="btn-tree" onClick={(e) => { e.stopPropagation(); onAddMeasure?.(node); }} >
              + Measure
            </button>
          );

        case "m":
          return (
            <button type="button" className="btn-tree" onClick={(e) => { e.stopPropagation(); onAddIndicator?.(node); }} >
              + Indicator
            </button>
          );

        default:
          return null;
      }
    })();

    return (
      <>
        <button type="button" className="btn-edit-tree cursor-pointer" onClick={(e) => { e.stopPropagation(); handleEdit(); }} >
          <Edit2 className="w-4" />
        </button>
        <button type="button" className="btn-delete-tree cursor-pointer" onClick={(e) => { e.stopPropagation(); handleDelete(); }} >
          <Trash2 className="w-4" />
        </button>

        {extraAction}
      </>
    );
  };

  if (node.isTitle) {
    return (
      <li>
        <div className="pl-2 pt-3 pb-1 text-md font-semibold text-slate-500 uppercase select-none" style={{ paddingLeft: indent }} >
          {node.label}
        </div>
      </li>
    );
  }


  return (
    <li className={`tree-node-group level-${node.data?.type}`}>
      <div className={`flex items-center gap-2 py-1 rounded-md ${ isSelected ? "bg-emerald-50" : "hover:bg-slate-50" }`} style={{ paddingLeft: indent }} onClick={() => onSelect(node)} >
        {node.data?.type !== "i" && (
          node.data?.count === 0 ? (
            <span className="inline-block w-6" />
          ) : (
            <button type="button" onClick={(e) => { e.stopPropagation(); onToggle(node.key); }} className="p-1 hover:bg-slate-200 rounded" >
              {expanded ? <ChevronDown className="w-4" /> : <ChevronRight className="w-4" />}
            </button>
          )
        )}
        {node.icon}
        <span className="font-medium text-sm">
          {node.label}
          {typeof node.data?.count === "number" && (
            <span className="ml-1 text-slate-500">({node.data.count})</span>
          )}
        </span>
        <div className="flex gap-1">
          {getActionButtons(node)}
        </div>
      </div>
      {!isLeaf && expanded && node.children && (
        <ul className={`tree-branch level-${node.data?.type}`}>
          {node.children.map(c => (
            <Item key={c.key} node={c} level={level + 1} expandedKeys={expandedKeys} onToggle={onToggle} onSelect={onSelect} selectedKey={selectedKey}
              onAddStrategicOutput={onAddStrategicOutput}
              onEditStrategicOutput={onEditStrategicOutput}
              onEditMeasure={onEditMeasure}
              onAddMeasure={onAddMeasure}
            />
          ))}
        </ul>
      )}
    </li>
  );
};
