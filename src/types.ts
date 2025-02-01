export interface HonoContext {
  Bindings: {
    ENVIRONMENT: string;
  };
}

export type HonoBindings = HonoContext["Bindings"];
