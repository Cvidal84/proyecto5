 
    export const cargarLista = async () => {
        const sheetID = '1YI0PUkw86Rtgq5EchflJRAetILyMfDq0dV2X5QhA2fg';
        const url = `https://docs.google.com/spreadsheets/d/${sheetID}/gviz/tq?tqx=out:json`;
      try {
        const res = await fetch(url);
        const text = await res.text();
        const json = JSON.parse(text.substring(47).slice(0, -2));
        const rows = json.table.rows;

        const lista = document.querySelector('.shopping-list > list-items');
        lista.innerHTML = '';

        rows.forEach(row => {
          const producto = row.c[0]?.v || '';
          const cantidad = row.c[1]?.v || '';

          const li = document.createElement('li');
          li.textContent = `${producto} (${cantidad})`;
          lista.appendChild(li);
        });
      } catch (error) {
        console.error('Error al cargar la hoja:', error);
      }
    };

