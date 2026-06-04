  import React, { useState, useCallback, useEffect } from "react";
  import { ChevronRight, ChevronDown, Edit2, Trash2, Eye, CheckCircle } from "lucide-react";
  import type { TreeNode } from "./TreeType";

  interface LazyTreeProps {
    value: TreeNode[];
    selectionKey?: string | null;
    onSelectionChange?: (key: string | null, node: TreeNode | null) => void;
    loadChildren?: (nodeKey: string,  page?: number) => Promise<TreeNode[]>;
    onAddStrategicOutput?: (node: TreeNode) => void;
    onEditStrategicOutput?: (node: TreeNode) => void;
    onDeleteStrategicOutput?: (node: TreeNode) => void;
    onAddMeasure?: (node: TreeNode) => void;
    onEditMeasure?: (node: TreeNode) => void;
    onDeleteMeasure?: (node: TreeNode) => void;
    onAddIndicator?: (node: TreeNode) => void;
    onEditIndicator?: (node: TreeNode) => void;
    onDeleteIndicator?: (node: TreeNode) => void;
    countryActive?: boolean;
    onFreezeCountry?: () => void;
    onRefreshNode?: (refreshFn: (key: string) => Promise<void>) => void;
  }

  export const LazyTree: React.FC<LazyTreeProps> = ({ value, selectionKey, onSelectionChange, loadChildren, onAddStrategicOutput, onEditStrategicOutput, onAddMeasure, onEditMeasure, onRefreshNode, onAddIndicator, onEditIndicator, onDeleteIndicator, onDeleteMeasure, onDeleteStrategicOutput, countryActive, onFreezeCountry }) => {

    const [internalValue, setInternalValue] = useState<TreeNode[]>(value);

    useEffect(() => {
      setInternalValue(value);
    }, [value]);

    const updateNodeByKey = useCallback(
      (nodes: TreeNode[], key: string, updater: (node: TreeNode) => TreeNode): TreeNode[] => {
        return nodes.map(node => {
          if (node.key === key) {
            return updater(node);
          }

          if (node.children) {
            return {
              ...node,
              children: updateNodeByKey(node.children, key, updater),
            };
          }

          return node;
        });
      },
      []
    );


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
      if (node.data?.type === "load-more" && loadChildren) {
        const { parentType, parentId, nextPage } = node.data;
        const parentKey = `${parentType}-${parentId}`;

        setInternalValue(prev =>updateNodeByKey(prev, key, n => ({...n,loading: true,})));
        const newChildren = await loadChildren(parentKey, nextPage);

        setInternalValue(prev =>
          updateNodeByKey(prev, parentKey, p => {
            const existing = (p.children ?? []).filter(
              c => c.data?.type !== "load-more"
            );

            return {...p, children: [...existing, ...newChildren], };
          })
        );

        return;
      }

      if (node.lazy && node.children === undefined && loadChildren) {
        node.loading = true;
        setExpandedKeys({ ...expandedKeys });
        try {
          node.children = await loadChildren(node.key, 1);

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

    const refreshNode = useCallback(async (key: string) => {
      if (!loadChildren) return;

      setInternalValue(prev =>
        updateNodeByKey(prev, key, node => ({
          ...node,
          loading: true,
          children: undefined,
        }))
      );

      const children = await loadChildren(key);
      const realChildren = children.filter(c => !c.isTitle);

      setInternalValue(prev =>
        updateNodeByKey(prev, key, node => ({
          ...node,
          loading: false,
          lazy: true,
          leaf: realChildren.length === 0,
          data: node.data
            ? { ...node.data, count: realChildren.length }
            : node.data,
          children,
        }))
      );

      setExpandedKeys(prev => ({ ...prev, [key]: true }));
    }, [loadChildren, updateNodeByKey]);


    useEffect(() => {
      if (onRefreshNode) onRefreshNode(refreshNode);
    }, [onRefreshNode, refreshNode]);


    return (
      <ul className="tree-root">
        {internalValue.map((n, i) => (
          <Item key={n.key} 
            node={n} 
            level={0} 
            index={i}
            path={n.data?.type === "country" ? [] : [i + 1]}
            expandedKeys={expandedKeys} 
            onToggle={toggle} 
            onSelect={select} 
            selectedKey={selectionKey ?? null}
            onAddStrategicOutput={onAddStrategicOutput}
            onEditStrategicOutput={onEditStrategicOutput}
            onAddMeasure={onAddMeasure}
            onEditMeasure={onEditMeasure}
            onEditIndicator={onEditIndicator}
            onAddIndicator={onAddIndicator}
            onDeleteIndicator={onDeleteIndicator}
            onDeleteMeasure={onDeleteMeasure}
            onDeleteStrategicOutput={onDeleteStrategicOutput}
            countryActive={countryActive}
            onFreezeCountry={onFreezeCountry}
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
    index: number;
    path: number[];
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
    countryActive?: boolean;
    onFreezeCountry?: () => void;
  }

  const Item: React.FC<ItemProps> = ({ node, level, path, index, expandedKeys, onToggle, onSelect, selectedKey, onAddStrategicOutput, onEditStrategicOutput, onAddMeasure, onEditMeasure, onAddIndicator, onEditIndicator, onDeleteMeasure, onDeleteIndicator, onDeleteStrategicOutput, countryActive, onFreezeCountry }) => {

    const isStructural = !node.isTitle && node.data?.type !== "i" && node.data?.type !== "country";
    const isNumbered = isStructural;
    const numbering = path.join(".");

    const expanded = !!expandedKeys[node.key];
    const isLeaf = node.leaf ?? false;
    const indent = (level * 1.75) + .5 + "rem";
    const isSelected = selectedKey === node.key;


    const getActionButtons = (node: TreeNode) => {
      const type = node.data?.type;
      if (!type || node.isTitle) return null;

      if (type === "country") {
        if (countryActive) return null;
        return (
          <button
            type="button"
            className="flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-md bg-blue-100 text-blue-700 hover:bg-blue-200 cursor-pointer transition"
            onClick={(e) => { e.stopPropagation(); onFreezeCountry?.(); }}
          >
            <CheckCircle className="w-3.5 h-3.5" />
            Confirm Dashboard
          </button>
        );
      }
      if (type === "ck") {
        if (countryActive) return null;
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
        if (countryActive) return null;
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
          {(!countryActive || type === "i") && (
            <button type="button" className="btn-edit-tree cursor-pointer" onClick={(e) => { e.stopPropagation(); handleEdit(); }} >
              <Edit2 className="w-4" />
            </button>
          )}
          {!countryActive && (
            <button type="button" className="btn-delete-tree cursor-pointer" onClick={(e) => { e.stopPropagation(); handleDelete(); }} >
              <Trash2 className="w-4" />
            </button>
          )}
          {extraAction}
        </>
      );
    };

    if (node.data?.type === "load-more") {
      return (
        <li style={{ paddingLeft: indent }}>
          <div className="flex items-center gap-2">
            <span className="w-4" /> 
            <button disabled={node.loading} className={`text-sm ${node.loading ? "text-slate-400" : "text-sky-600 hover:text-sky-700 cursor-pointer"}`} onClick={(e) => { e.stopPropagation(); if (!node.loading) onToggle(node.key); }}>
              {node.loading ? "Loading..." : 
              <span className="flex items-center justify-center gap-1">
                <Eye className="w-5 h-5"/>
                {node.label}
              </span>}
            </button>
          </div>
        </li>
      );
    }

    return (
      <li key={index} className={`tree-node-group level-${node.data?.type}`}>
        <div className={`flex items-center gap-2 py-1 rounded-md ${ isSelected ? "bg-blue-50" : "hover:bg-slate-50" }`} style={{ paddingLeft: indent }} onClick={() => onSelect(node)} >
          {node.data?.type !== "i" && (
            <button type="button" onClick={(e) => { e.stopPropagation(); onToggle(node.key);}} disabled={node.data?.count === 0} className={`p-1 rounded ${node.data?.count === 0 ? "opacity-0 cursor-default" : "hover:bg-slate-200"}`}>
              {expanded ? (<ChevronDown className="w-4" />) : (<ChevronRight className="w-4" />)}
            </button>
          )}
          <span className="hidden md:inline-flex">
            {node.icon}
          </span>
            <span   className="flex items-center gap-2 text-sm font-medium">
              <span className="flex items-center gap-2 text-sm">
                {node.data?.type === "i" ? (
                  <span className="flex flex-col space-y-1">
                    <span className="flex items-center gap-2 text-slate-700">
                      {isNumbered && (
                        <span className="text-slate-400 text-xs font-semibold">
                          {numbering}
                        </span>
                      )}
                      <span>{node.label}</span>
                    </span>

                    <span className="flex space-x-2">
                      <span className="flex items-center gap-1 text-slate-600">
                        target:
                        <span className="rounded-md bg-[#61C8E7]/20 px-2 py-0.5 text-xs font-semibold text-[#1E3291]">
                          {node.meta?.target}
                        </span>
                      </span>
                      <span key={node.meta?.type_id} className="rounded-md bg-[#0082BE] px-2 py-0.5 text-xs font-semibold text-white" >
                        {node.meta?.type}
                      </span>
                    </span>
                  </span>
                ) : (
                  <span className="flex items-center gap-2 text-slate-700">
                    {isStructural && (
                      <span className="font-semibold">
                        {numbering+"."}
                      </span>
                    )}
                    <span>{node.label}</span>
                  </span>
                )}
              </span> 
              {typeof node.data?.count === "number" && (
                <span className="text-slate-400">({node.data.count})</span>
              )}
            </span>
          <div className="flex gap-1">
            {getActionButtons(node)}
          </div>
        </div>
        {!isLeaf && expanded && node.children && (
          <ul className={`tree-branch level-${node.data?.type}`}>
            {(node.children ?? []).map((c, i) => {
              const previousStructuralSiblings = (node.children ?? []).slice(0, i).filter(x =>!x.isTitle &&x.data?.type !== "i" &&x.data?.type !== "country");
              const structuralIndex = previousStructuralSiblings.length + 1;
              const isStructuralChild = !c.isTitle && c.data?.type !== "i" && c.data?.type !== "country";
              const nextPath = isStructuralChild ? [...path, structuralIndex] : path;

              return (
                <Item
                  key={c.key}
                  node={c}
                  level={level + 1}
                  index={i}
                  path={nextPath}
                  expandedKeys={expandedKeys}
                  onToggle={onToggle}
                  onSelect={onSelect}
                  selectedKey={selectedKey}
                  onAddStrategicOutput={onAddStrategicOutput}
                  onEditStrategicOutput={onEditStrategicOutput}
                  onEditMeasure={onEditMeasure}
                  onAddMeasure={onAddMeasure}
                  onAddIndicator={onAddIndicator}
                  onEditIndicator={onEditIndicator}
                  onDeleteIndicator={onDeleteIndicator}
                  onDeleteMeasure={onDeleteMeasure}
                  onDeleteStrategicOutput={onDeleteStrategicOutput}
                  countryActive={countryActive}
                  onFreezeCountry={onFreezeCountry}
                />
              );
          })}

          </ul>
        )}
      </li>
    );
  };
