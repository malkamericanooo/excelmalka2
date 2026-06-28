export function useToast() {
  return {
    toast: (_: unknown) => {},
    dismiss: (_?: string) => {},
    toasts: [] as unknown[],
  };
}

export function toast(_: unknown) {}
