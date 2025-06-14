export const getShoppingList = async () => {
  const sheetID = "1YI0PUkw86Rtgq5EchflJRAetILyMfDq0dV2X5QhA2fg";
  const url = `https://docs.google.com/spreadsheets/d/${sheetID}/gviz/tq?tqx=out:json`;

  try {
    const res = await fetch(url);
    const text = await res.text();
    const json = JSON.parse(text.substring(47).slice(0, -2));
    const rows = json.table.rows;

    // Mapear filas a array de tareas con texto
    const tasks = rows.slice(1).map(row => {
        const producto = row.c[0]?.v || "";
        const cantidad = row.c[1]?.v || "";
        return `${producto} (${cantidad})`;
    });

    return tasks; // Devuelve el array para que lo use quien llame
  } catch (error) {
    console.error("Error al cargar la hoja:", error);
    return []; // En error devolver array vacío
  }
};

