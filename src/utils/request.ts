// This helper is intentionally reserved for template demo data only.
// Real backend requests must go through src/api/ApiMethod.js so every API
// call shares the same BASE_URL configuration as nk-admin.
const mockUrls = import.meta.glob<{ default: string }>("../mock/*.json", {
  query: "url",
  eager: true,
});

export async function request<T>(
  path: string,
  options?: RequestInit
): Promise<T> {
  const mockUrl = mockUrls[`../mock${path}.json`]?.default;

  if (!mockUrl) {
    throw new Error(`Không tìm thấy dữ liệu mẫu cho đường dẫn: ${path}`);
  }

  const response = await fetch(mockUrl, options);
  if (!response.ok) {
    throw new Error(`Không thể tải dữ liệu mẫu: ${path}`);
  }
  return response.json() as Promise<T>;
}

export async function requestWithFallback<T>(
  path: string,
  fallbackValue: T,
  options?: RequestInit
): Promise<T> {
  try {
    return await request<T>(path, options);
  } catch (error) {
    console.warn(
      "Không tải được dữ liệu mẫu. Sử dụng giá trị dự phòng."
    );
    console.warn({ path, error, fallbackValue });
    return fallbackValue;
  }
}
