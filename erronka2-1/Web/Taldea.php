<?php include '../includes/header.php'; ?>

    <!-- Taldearen xehetasunak -->
    <section class="team-detail-section">
        <div class="container-content">
            <div class="team-detail-header">
                <button class="btn-back" onclick="history.back()">
                    <i class="fas fa-arrow-left"></i> Atzera
                </button>
                <div class="page-info">
                    <h1 class="section-title" id="team-title">Taldearen Xehetasunak</h1>
                    <p class="page-subtitle">Talde honen informazio osoa eta estatistikak</p>
                </div>
            </div>

            <!-- Breadcrumb navigation -->
            <nav class="breadcrumb" aria-label="breadcrumb">
                <ol class="breadcrumb-list">
                    <li class="breadcrumb-item"><a href="Hasiera.php">Hasiera</a></li>
                    <li class="breadcrumb-item"><a href="Sailkapena.php">Sailkapena</a></li>
                    <li class="breadcrumb-item active" id="breadcrumb-team">Taldea</li>
                </ol>
            </nav>

            <div class="team-detail-content" id="team-detail-content">
                <div class="loading-message">
                    <i class="fas fa-spinner fa-spin"></i>
                    <p>Taldearen datuak kargatzen...</p>
                </div>
            </div>
        </div>
    </section>

    <script src="../script/taldea-detail.js"></script>

<?php include '../includes/footer.php'; ?>