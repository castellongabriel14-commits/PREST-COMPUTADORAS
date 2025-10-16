document.addEventListener('DOMContentLoaded', function() {
    
    // Clave para el almacenamiento en LocalStorage
    const CACHE_KEY_STATS = 'loan_stats_cache';
    const CACHE_KEY_USERNAME = 'app_username';

    // Función para simular la obtención de datos (en un entorno real, esto sería una llamada AJAX/Fetch)
    function fetchAndCacheData() {
        const cachedData = localStorage.getItem(CACHE_KEY_STATS);
        
        // 1. INTENTAR CARGAR DATOS DEL CACHÉ
        if (cachedData) {
            console.log("Cargando estadísticas desde el caché local...");
            const stats = JSON.parse(cachedData);
            updateDashboardStats(stats);
        }

        // 2. SIMULAR CARGA DE DATOS REALES (asíncrona)
        // En un entorno real, esto sería una llamada a, por ejemplo, 'data_api.php'
        setTimeout(() => {
            const freshStats = {
                total: Math.floor(Math.random() * 10) + 140, // Número simulado
                available: Math.floor(Math.random() * 10) + 115,
                loaned: Math.floor(Math.random() * 5) + 25,
                timestamp: new Date().toLocaleString()
            };

            const activeLoans = [
                { id: 1, internal_id: 'LT-012', student_name: 'Carlos Ruiz', expected_return: '2025-11-05' },
                { id: 2, internal_id: 'PC-005', student_name: 'Ana López', expected_return: '2025-10-30' },
                { id: 3, internal_id: 'MN-030', student_name: 'Javier Pérez', expected_return: '2025-10-28' }
            ];

            console.log("Datos frescos obtenidos. Actualizando y cacheando...");
            
            // Actualizar el Dashboard con los datos frescos
            updateDashboardStats(freshStats);
            updateActiveLoansTable(activeLoans);
            
            // Guardar los datos frescos en el caché
            localStorage.setItem(CACHE_KEY_STATS, JSON.stringify(freshStats));

        }, cachedData ? 500 : 1500); // Carga rápida si hay caché, más lenta si es la primera vez
    }

    // Función para actualizar los elementos del Dashboard
    function updateDashboardStats(stats) {
        document.getElementById('total-equipos').textContent = stats.total;
        document.getElementById('equipos-disponibles').textContent = stats.available;
        document.getElementById('equipos-prestamo').textContent = stats.loaned;
        
        // Opcional: Mostrar cuándo fue la última actualización del caché (simulación)
        const cacheIndicator = document.createElement('small');
        cacheIndicator.className = 'd-block text-muted mt-2';
        cacheIndicator.innerHTML = `<i class="fas fa-clock"></i> Última actualización: ${stats.timestamp} (Simulado)`;
        const cardsContainer = document.getElementById('summary-cards');
        if (cardsContainer.querySelector('small')) {
             cardsContainer.querySelector('small').remove();
        }
        cardsContainer.parentNode.insertBefore(cacheIndicator, cardsContainer.nextSibling);
    }
    
    // Función para simular la tabla de préstamos
    function updateActiveLoansTable(loans) {
        const tableBody = document.getElementById('active-loans-table-body');
        tableBody.innerHTML = ''; // Limpiar
        
        if (loans.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="4" class="text-center text-muted">No hay préstamos activos registrados.</td></tr>';
            return;
        }

        loans.forEach(loan => {
            const dateDisplay = new Date(loan.expected_return).toLocaleDateString('es-ES', { year: 'numeric', month: '2-digit', day: '2-digit' });
            const row = `
                <tr>
                    <td>${loan.internal_id}</td>
                    <td>${loan.student_name}</td>
                    <td>${dateDisplay}</td>
                    <td>
                        <a href="procesar.php?action=return_loan&id=${loan.id}" class="btn btn-sm btn-success btn-devolver">
                            <i class="fas fa-undo-alt"></i> Devolver
                        </a>
                    </td>
                </tr>
            `;
            tableBody.insertAdjacentHTML('beforeend', row);
        });
    }

    // ----------------------------------------------------
    // MANEJO DE CACHÉ PARA DATOS DE USUARIO
    // ----------------------------------------------------
    function initUserCache() {
        let username = localStorage.getItem(CACHE_KEY_USERNAME);
        const userDisplay = document.getElementById('user-display');
        
        if (!username) {
            // Simulación: Si no hay caché, establecemos un valor por defecto.
            username = 'Admin'; 
            localStorage.setItem(CACHE_KEY_USERNAME, username);
        }
        
        // Mostrar el nombre de usuario (ya sea del caché o por defecto)
        userDisplay.textContent = username;
    }
    
    // ----------------------------------------------------
    // INICIALIZACIÓN
    // ----------------------------------------------------
    initUserCache();
    fetchAndCacheData();

    // ----------------------------------------------------
    // Lógica para el botón Devolver (para enlaces estáticos)
    // ----------------------------------------------------
    document.querySelectorAll('.btn-devolver').forEach(button => {
        button.addEventListener('click', function(event) {
            if (!confirm(`¿Está seguro de marcar la devolución del equipo?`)) {
                event.preventDefault(); // Detiene la navegación si se cancela
            }
        });
    });
});
