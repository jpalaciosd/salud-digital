// Lista única de emails con rol admin automático.
// Si un user con uno de estos emails se registra (Google OAuth o email/contraseña)
// queda con rol="admin" sin importar lo que pida el form.
// También: si ya existe con otro rol, se promueve al hacer login.
export const ADMIN_EMAILS = [
  "juandiegopalaciosdelgado@gmail.com",
  "fernandocuartasarboleda@gmail.com",
  "paulakt26@gmail.com",
];

export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email.toLowerCase());
}
