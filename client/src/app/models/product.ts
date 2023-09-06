export interface Product {
  id: 0;
  name: string;
  description: string;
  price: 0;
  pictureUrl: string;
  type: string;
  brand: string;
  quantityInStock: number;
}
export interface productParams {
  orderBy: string;
  searchTerm?: string;
  types: string[];
  brands: string[];
  pageSize: number;
  pageNumber: number;
}
