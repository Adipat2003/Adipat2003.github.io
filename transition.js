document.getElementById('next-button').addEventListener('click', function() {
    document.getElementById('welcome-page').style.display = 'none';
    document.getElementById('chart-page').style.display = 'block';
    document.body.classList.add('chart-page'); // Add the class here
  });
  