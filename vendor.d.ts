declare module 'vue3-smooth-dnd';
import "@tanstack/vue-table";

// Type definitions for vue-virtual-scroller
// Project: https://github.com/Akryum/vue-virtual-scroller/
declare module 'vue-virtual-scroller' {
  import Vue, { PluginObject } from 'vue';

  interface PluginOptions {
    componentsPrefix?: string;
    installComponents?: boolean;
  }

  declare const plugin: PluginObject<PluginOptions> & { version: string };

  export class RecycleScroller extends Vue {
    sizes: Array<{ accumulator: number }>;
    itemSize: number | null;
    totalSize: number;
    ready: boolean;
    emitUpdate: boolean;
    prerender: number;
    pageMode: boolean;
    buffer: number;
    typeField: string;
    sizeField: string;
    minItemSize: number | string | null;
    direction: 'horizontal' | 'vertical';
    pool: Array<{
      item: unknown;
      nr: {
        id: number;
        index: number;
        key: string;
        type: unknown;
        used: boolean;
      };
      position: number;
    }>;

    getScroll(): { end: number; start: number; };

    scrollToItem(index: number): void;

    scrollToPosition(position: number);
  }

  export class DynamicScroller extends RecycleScroller {
    minItemSize: number | string;
    vscrollData: {
      active: boolean;
      keyField: string;
      simpleArray: boolean;
      sizes: Record<string, number>;
      validSizes: object;
    };

    $refs: {
      scroller: RecycleScroller;
    };

    onScrollerResize(): void;

    onScrollerVisible(): void;

    forceUpdate(clear?: boolean): void;

    scrollToItem(index: number): void;

    getItemSize(item: object, index?: number): number;

    scrollToBottom(): void;
  }

  export class DynamicScrollerItem extends Vue {

  }

  export default plugin;
}


declare module "@tanstack/vue-table" {
  interface ColumnMeta {
    cellClassName?: string;
    headerClassName?: string;
  }
}
