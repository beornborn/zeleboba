// function sendMessage(message) {
//   // Set dummy text in the textarea by placeholder
//   const placeholderText = 'Type a message';
//   let textareaElement = getElementByPlaceholder(placeholderText);

//   console.log(message);
//   if (textareaElement) {
//     const originalString = textareaElement.outerHTML;
//     const position = originalString.indexOf('</textarea>');
//     const modifiedString =
//       originalString.slice(0, position) +
//       message +
//       originalString.slice(position);
//     textareaElement.outerHTML = modifiedString;
//   } else {
//     console.error(
//       `Textarea element with placeholder "${placeholderText}" not found.`
//     );
//   }

//   // Click the button by its inner text
//   const buttonElement = getButtonByText();

//   if (buttonElement) {
//     console.log(buttonElement);
//     buttonElement.outerHTML =
//       '<button type="submit" class="button Lts($ls-s) Z(0) CenterAlign Mx(a) Cur(p) Tt(u) Ell Bdrs(100px) Px(24px) Px(20px)--s Py(0) Mih(40px) Pos(r) Ov(h) C(#fff) Bg($c-pink):h::b Bg($c-pink):f::b Bg($c-pink):a::b Trsdu($fast) Trsp($background) Bg($g-ds-background-brand-gradient) button--primary-shadow StyledButton Bxsh($bxsh-btn) Fw($semibold) focus-button-style Mb(16px) As(fe)" draggable="false" tabindex="-1"><span class="Pos(r) Z(1)">Send</span></button>';
//     buttonElement.click();
//   } else {
//     console.error(`Button element not found.`);
//   }
// }

// // Function to find an element by placeholder text
// function getElementByPlaceholder(placeholderText) {
//   const elements = document.querySelectorAll(
//     `[placeholder="${placeholderText}"]`
//   );
//   return elements.length > 0 ? elements[0] : null;
// }

// // Function to find a button element by its inner text
// function getButtonByText() {
//   const buttons = document.querySelectorAll(`button`);
//   return buttons.length > 0 ? buttons[buttons.length - 1] : null;
// }
