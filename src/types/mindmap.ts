export interface MindMapNode {
  id: string;
  text: string;
  color: string;
  x: number;
  y: number;
  parentId: string | null;
  children: string[];
}

export interface MindMapData {
  nodes: { [key: string]: MindMapNode };
  rootId: string;
}
