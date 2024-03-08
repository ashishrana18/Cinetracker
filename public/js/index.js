async function searchMovies() {
    const searchInput = document.getElementById("searchInput").value;
    const response = await fetch(`/movies/search?query=${searchInput}`);
    const { movies } = await response.json();

    const container = document.querySelector(".container");
    container.innerHTML = "";

    if (movies.length === 0) {
      // Display a message when no results are found
      const noResultsMessage = document.createElement("div");
      noResultsMessage.className = "no-results";
      noResultsMessage.textContent = "No results found.";
      container.appendChild(noResultsMessage);
    } else {
      movies.forEach((movie) => {
        const movieDiv = document.createElement("div");
        movieDiv.className = "movie";

        const img = document.createElement("img");
        img.src = movie.src;
        movieDiv.appendChild(img);

        const heading = document.createElement("h3");
        heading.innerHTML = `<b>${movie.name}</b>`;
        movieDiv.appendChild(heading);

        const genre = document.createElement("h5");
        genre.textContent = movie.genre;
        movieDiv.appendChild(genre);

        let movieButtons = document.createElement("div");
        movieButtons.className = "movie-buttons";

        const editLink = document.createElement("a");
        editLink.href = `http://localhost:3000/movies/${movie._id}/edit`;
        editLink.innerHTML = "<b>Edit</b>";
        movieButtons.appendChild(editLink);

        const detailsLink = document.createElement("a");
        detailsLink.href = `http://localhost:3000/movies/${movie._id}`;
        detailsLink.innerHTML = "<b>See in Detail</b>";
        movieButtons.appendChild(detailsLink);

        const deleteForm = document.createElement("form");
        deleteForm.method = "post";
        deleteForm.action = `/movies/${movie._id}?_method=DELETE`;

        const deleteButton = document.createElement("button");
        deleteButton.innerHTML = "<b>Delete</b>";
        deleteForm.appendChild(deleteButton);

        movieButtons.appendChild(deleteForm);

        movieDiv.appendChild(movieButtons);
        container.appendChild(movieDiv);

        editLink.addEventListener("click", () => {
          window.location.href = `http://localhost:3000/movies/${movie._id}/edit`;
        });

        detailsLink.addEventListener("click", () => {
          window.location.href = `http://localhost:3000/movies/${movie._id}`;
        });

        deleteForm.addEventListener("submit", async (event) => {
          event.preventDefault();
          await fetch(`/movies/${movie._id}?_method=DELETE`, {
            method: "POST"
          });
          searchMovies();
        });
      });
    }
  }

  // Add event listener for the Enter key
  document
    .getElementById("searchInput")
    .addEventListener("keydown", function (event) {
      if (event.key === "Enter") {
        searchMovies();
      }
    });

  async function sortMoviesByRating() {
    try {
      const response = await fetch("/movies/sortByRating");

      if (!response.ok) {
        throw new Error(
          `Failed to fetch movies. Status: ${response.status}`
        );
      }

      const { movies } = await response.json();

      const container = document.querySelector(".container");
      container.innerHTML = "";

      if (movies.length === 0) {
        const noResultsDiv = document.createElement("div");
        noResultsDiv.className = "no-results";
        noResultsDiv.textContent = "No results found.";
        container.appendChild(noResultsDiv);
        return;
      }

      movies.forEach((movie) => {
        const movieDiv = document.createElement("div");
        movieDiv.className = "movie";

        const img = document.createElement("img");
        img.src = movie.src;
        movieDiv.appendChild(img);

        const heading = document.createElement("h3");
        heading.innerHTML = `<b>${movie.name}</b>`;
        movieDiv.appendChild(heading);

        const genre = document.createElement("h5");
        genre.innerHTML = `<b>Genre : ${movie.genre}</b>`;
        // genre.innerHTML = <b>movie.genre</b>;
        movieDiv.appendChild(genre);

        let movieButtons = document.createElement("div");
        movieButtons.className = "movie-buttons";

        // const editLink = document.createElement("a");
        // editLink.href = `http://localhost:3000/movies/${movie._id}/edit`;
        // editLink.innerHTML = "<b>Edit</b>";
        // movieButtons.appendChild(editLink);

        const detailsLink = document.createElement("a");
        detailsLink.href = `http://localhost:3000/movies/${movie._id}`;
        detailsLink.innerHTML = "<b>See in Detail</b>";
        movieButtons.appendChild(detailsLink);

        // const deleteForm = document.createElement("form");
        // deleteForm.method = "post";
        // deleteForm.action = `/movies/${movie._id}?_method=DELETE`;

        // const deleteButton = document.createElement("button");
        // deleteButton.innerHTML = "<b>Delete</b>";
        // deleteForm.appendChild(deleteButton);

        // movieButtons.appendChild(deleteForm);

        movieDiv.appendChild(movieButtons);
        container.appendChild(movieDiv);

        // Add event listeners as before
        // editLink.addEventListener("click", () => {
        //   window.location.href = `http://localhost:3000/movies/${movie._id}/edit`;
        // });

        detailsLink.addEventListener("click", () => {
          window.location.href = `http://localhost:3000/movies/${movie._id}`;
        });

        // deleteForm.addEventListener("submit", async (event) => {
        //   event.preventDefault();
        //   await fetch(`/movies/${movie._id}?_method=DELETE`, {
        //     method: "POST"
        //   });
        //   sortMoviesByRating(); // Refresh the movie list after deletion
        // });
      });
    } catch (error) {
      console.error(error);
      alert("An error occurred while fetching movies.");
    }
  }