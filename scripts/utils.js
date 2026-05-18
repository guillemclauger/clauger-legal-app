/**
 * ============================================================================
 * CLAUGER - Sistema de Informes Técnicos
 * ============================================================================
 * Archivo: utils.js
 * Descripción: Funciones de utilidad generales
 * Versión: 1.1
 * ============================================================================
 */

const Utils = {
    /**
     * Muestra una imagen en el modal
     * @param {string} src - URL de la imagen
     */
    viewImage(src) {
        const modal = document.getElementById('imageModal');
        const img = document.getElementById('modalImage');
        if (modal && img) {
            modal.classList.add('show');
            img.src = src;
        }
    },

    /**
     * Cierra el modal de imágenes
     */
    closeImageModal() {
        const modal = document.getElementById('imageModal');
        if (modal) {
            modal.classList.remove('show');
        }
    },

    /**
     * Muestra un mensaje toast
     * @param {string} message - Mensaje a mostrar
     * @param {string} type - Tipo de mensaje ('success' o 'error')
     */
    showToast(message, type) {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    },

    /**
     * Calcula el PCA y las toneladas equivalentes de CO2
     * @param {string} refrigerante - Tipo de refrigerante
     * @param {number} carga - Carga en kg
     * @returns {Object} Objeto con pca y tnCO2
     */
    calculatePCA(refrigerante, carga) {
        const pca = REFRIGERANTES_PCA[refrigerante] || '';
        const cargaNum = parseFloat(carga) || 0;
        const tnCO2 = pca !== '' && cargaNum > 0 ? ((cargaNum * pca) / 1000).toFixed(3) : '';
        return { pca, tnCO2 };
    },

    /**
     * Formatea una fecha a DD/MM/AAAA
     * @param {Date|string} date - Fecha a formatear
     * @returns {string} Fecha formateada
     */
    formatDate(date) {
        if (!date) return '';
        const d = new Date(date);
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const year = d.getFullYear();
        return `${day}/${month}/${year}`;
    },

    /**
     * Genera un ID único
     * @returns {string} ID único
     */
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    },

    /**
     * Hace scroll al inicio del workspace
     */
    scrollToTop() {
        const workspace = document.getElementById('workspace');
        if (workspace) {
            workspace.scrollTop = 0;
            workspace.scrollTo({ top: 0, behavior: 'instant' });
        }
    }
};
