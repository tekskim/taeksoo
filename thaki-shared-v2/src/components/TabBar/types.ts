import { DragAndDropItem } from '../../services/hooks/useDragAndDrop';

export interface TabItem extends DragAndDropItem {
  id: string;
  title: string;
  draggable?: boolean;
  fixed?: boolean;
}
