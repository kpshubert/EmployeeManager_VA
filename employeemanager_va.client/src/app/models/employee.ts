export interface Employee {
  [rowNum: string]: number | string;
  id: number;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  departmentId: number;
  departmentIdString: string;
  departmentName: string;
  formMode: string
}
