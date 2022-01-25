import jQuery from "jquery";

const $ = jQuery;

export const removeCover = () => {
  let cover = $('#black-cover')
  setTimeout(() => {
    cover.addClass('fadeOut')
  }, 1000)
}
