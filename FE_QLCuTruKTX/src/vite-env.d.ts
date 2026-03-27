/// <reference types="vite/client" />

// (không bắt buộc) khai báo biến env bạn dùng để có IntelliSense
interface ImportMetaEnv {
  readonly VITE_API_BASE?: string;
}
interface ImportMeta {
  readonly env: ImportMetaEnv;
}
