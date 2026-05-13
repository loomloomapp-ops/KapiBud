export function formatPhone(input: string): string {
  let digits = input.replace(/\D/g, '');
  if (digits.startsWith('380')) digits = digits.slice(3);
  else if (digits.startsWith('38')) digits = digits.slice(2);
  if (digits.startsWith('0')) digits = digits.slice(1);
  digits = digits.slice(0, 9);

  const p1 = digits.slice(0, 2);
  const p2 = digits.slice(2, 5);
  const p3 = digits.slice(5, 7);
  const p4 = digits.slice(7, 9);

  let out = '+38';
  if (digits.length === 0) return '+38 (0';
  out += ' (0' + p1;
  if (digits.length >= 2) out += ')';
  if (p2) out += ' ' + p2;
  if (p3) out += ' ' + p3;
  if (p4) out += ' ' + p4;
  return out;
}

export function isValidPhone(value: string): boolean {
  return value.replace(/\D/g, '').replace(/^380/, '').length === 9;
}
