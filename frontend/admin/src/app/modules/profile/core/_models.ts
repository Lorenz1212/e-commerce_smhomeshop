export interface UserDetailsModel {
  personal_info: {
    fname: string
    lname: string
    mname: string
    suffix: string
    birthdate: string
    gender: string
    contact_no: string
    address: string
    image_cover?: string,
    full_name:string,
    birth_date_format:string,
  }
  user: {
    email: string
  }
  roles: number | null
  modules: string[]
}

export interface IUpdateEmail {
  email: string;
  confirm_password: string;
}

export interface IUpdatePassword {
  current_password: string;
  new_password: string;
  new_password_confirmation: string;
}

export const updateEmail: IUpdateEmail = {
  email: "",
  confirm_password: "",
};

export const updatePassword: IUpdatePassword = {
  current_password: "",
  new_password: "",
  new_password_confirmation: "",
};