// Simple registry to manage automatic refetching across components
type RefreshCallback = () => void;

let cacheInstance: Map<string, { data: unknown; timestamp: number }> | null = null;

class RefreshRegistry {
  private registry = new Map<string, Set<RefreshCallback>>();

  setCache(cache: Map<string, { data: unknown; timestamp: number }>) {
    cacheInstance = cache;
  }

  register(resource: string, callback: RefreshCallback) {
    if (!this.registry.has(resource)) {
      this.registry.set(resource, new Set());
    }
    this.registry.get(resource)!.add(callback);

    return () => {
      const callbacks = this.registry.get(resource);
      if (callbacks) {
        callbacks.delete(callback);
        if (callbacks.size === 0) {
          this.registry.delete(resource);
        }
      }
    };
  }

  invalidate(resources: string | string[]) {
    const resourceArray = Array.isArray(resources) ? resources : [resources];

    resourceArray.forEach((resource) => {
      if (cacheInstance) {
        const keysToDelete: string[] = [];
        cacheInstance.forEach((_, key) => {
          keysToDelete.push(key);
        });
        keysToDelete.forEach((key) => cacheInstance!.delete(key));
      }

      const callbacks = this.registry.get(resource);
      if (callbacks) {
        callbacks.forEach((callback) => callback());
      }
    });
  }

  clear() {
    this.registry.clear();
  }
}

export const refreshRegistry = new RefreshRegistry();
