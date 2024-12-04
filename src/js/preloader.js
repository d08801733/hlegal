window.onload = () => {
  const preloaderContainer = document.querySelector(".preloader-container");
  const preloader = document.querySelector(".preloader");

  setTimeout(() => {
    preloaderContainer.classList.add("hidden");
    preloader.classList.add("hidden");
  }, 1600);
};
