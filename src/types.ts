export interface HonoContext {
  Bindings: {
    ENVIRONMENT: string;
    API_VERSION?: string;
  };
}

export type HonoBindings = HonoContext["Bindings"];
