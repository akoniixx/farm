export function containsEmoji(str: string) {
  const emojiRange = /[\uD800-\uDBFF][\uDC00-\uDFFF]/;
  return emojiRange.test(str);
}
export function containsSpecialCharacter(str: string) {
  const specialCharacterRange = /[!@#$%^&*()-=,.?":{}|<>]/;
  return specialCharacterRange.test(str);
}

export function mixValidator(str: string) {
  if (containsEmoji(str)) {
    console.log('containsEmoji');
    return '';
  }
  if (containsSpecialCharacter(str)) {
    console.log('containsSpecialCharacter');
    return '';
  }
  return str;
}
