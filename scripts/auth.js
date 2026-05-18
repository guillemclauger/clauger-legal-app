/**
 * ============================================================================
 * CLAUGER - Sistema de Informes Técnicos
 * ============================================================================
 * Archivo: auth.js
 * Descripción: Sistema de autenticación y login
 * Versión: 1.1
 * ============================================================================
 */

const Auth = {
    /**
     * Login directo para técnicos (sin contraseña)
     */
    loginTecnico() {
        AppState.isLegalMode = false;
        document.getElementById('loginOverlay').style.display = 'none';
        document.getElementById('app').classList.add('show');
        document.getElementById('modeIndicator').textContent = 'Acceso Técnicos';
        
        // Inicializar la aplicación
        if (typeof App !== 'undefined' && App.init) {
            App.init();
        }
    },

    /**
     * Muestra el formulario de contraseña para acceso legal
     */
    showPasswordForm() {
        document.getElementById('loginOptions').style.display = 'none';
        document.getElementById('passwordForm').classList.add('show');
        document.getElementById('passwordInput').focus();
    },

    /**
     * Login para departamento legal (con contraseña)
     */
    loginLegal() {
        const password = document.getElementById('passwordInput').value;
        
        if (password === CONFIG.LEGAL_PASSWORD) {
            AppState.isLegalMode = true;
            document.getElementById('loginOverlay').style.display = 'none';
            document.getElementById('app').classList.add('show');
            document.getElementById('modeIndicator').textContent = 'Departamento Legal';
            document.getElementById('legalBadge').style.display = 'block';
            document.getElementById('btnActaInicial').style.display = 'block';
            
            // Inicializar la aplicación
            if (typeof App !== 'undefined' && App.init) {
                App.init();
            }
        } else {
            document.getElementById('passwordError').classList.add('show');
            document.getElementById('passwordInput').value = '';
            document.getElementById('passwordInput').focus();
            setTimeout(() => {
                document.getElementById('passwordError').classList.remove('show');
            }, 3000);
        }
    },

    /**
     * Vuelve a la pantalla de opciones de login
     */
    backToOptions() {
        document.getElementById('passwordForm').classList.remove('show');
        document.getElementById('loginOptions').style.display = 'flex';
        document.getElementById('passwordInput').value = '';
        document.getElementById('passwordError').classList.remove('show');
    },

    /**
     * Cierra la sesión y recarga la página
     */
    logout() {
        if (confirm('¿Cerrar sesión y volver al inicio?')) {
            location.reload();
        }
    }
};

// ============================================================================
// EVENT LISTENER PARA ENTER EN EL CAMPO DE CONTRASEÑA
// ============================================================================
document.addEventListener('DOMContentLoaded', function() {
    const passwordInput = document.getElementById('passwordInput');
    if (passwordInput) {
        passwordInput.addEventListener('keypress', function(event) {
            if (event.key === 'Enter') {
                Auth.loginLegal();
            }
        });
    }
});
