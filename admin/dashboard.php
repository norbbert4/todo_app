<?php
// Header
$pageTitle = 'Admin - Dashboard';
$pageScript = 'dashboard';
include './components/header.php';
// Navigation
include './components/navigation.php';
?>

    <main>

        <nav class="bg-body-dark p-2 mb-2 text-end d-flex flex-row-reverse">
            <a class="btn btn-sm btn-danger" href="logout.html">Kijelentkezés</a>
            <p class="py-0 px-4 m-0">Bejelentkezve: <span class="logged"><span></p>
        </nav>

        Üdv az oldalon!

    </main>

</body>
</html>