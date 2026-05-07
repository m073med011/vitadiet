declare module "aos" {
  type AosOptions = {
    anchorPlacement?: string;
    delay?: number;
    disable?: boolean | string | (() => boolean);
    duration?: number;
    easing?: string;
    offset?: number;
    once?: boolean;
  };

  const AOS: {
    init: (options?: AosOptions) => void;
    refresh: () => void;
    refreshHard: () => void;
  };

  export default AOS;
}
