from flask import Flask, jsonify, request
from flask_cors import CORS
import pymysql

# HOLII, hice rutas individuales con todas las tablas para probar, 
# sos libre de eliminarlas si no te sirven (˶>⩊<˶)

app = Flask(__name__) 
CORS(app)

def conectar():
    return pymysql.connect(
        host="localhost",
        user="root",
        password="",
        database="reserva_hotel",
        cursorclass=pymysql.cursors.DictCursor
    )

@app.route("/")
def inicio():
    return "omg es la pagina de inicio"

@app.route("/paises")
def listar_paises():
    conexion = conectar()
    with conexion.cursor() as cursor:
        cursor.execute("SELECT cod_pais, descrip FROM pais")
        datos = cursor.fetchall()
    conexion.close()
    return jsonify(datos)

@app.route("/reservas")
def listar_reservas():
    conexion = conectar()

    try:
        nombre = request.args.get("nombre", "").strip()
        apellido = request.args.get("apellido", "").strip()
        fecha = request.args.get("fecha", "").strip()
        estado = request.args.get("estado", "").strip()

        consulta = """
            SELECT
                r.Cod_reserva AS codigo,
                CONCAT(c.Nombre, ' ', c.Apellido) AS cliente,
                h.Nombre AS hotel,
                CONCAT(
                    r.Dia_llegada, '/',
                    r.Mes_llegada, '/',
                    r.Anio_llegada
                ) AS llegada,
                th.Descrip AS habitacion,
                r.Cancelado AS cancelado
            FROM reserva r
            INNER JOIN cliente c
                ON r.Rsv_cliente = c.Cod_cliente
            INNER JOIN hotel h
                ON r.Rsv_hotel = h.Cod_hotel
            LEFT JOIN tipo_habitacion th
                ON r.Rsv_hab_a = th.Cod_habitacion
            WHERE 1=1
        """

        parametros = []

        if nombre:
         consulta += " AND c.Nombre = %s"
         parametros.append(nombre)

        if apellido:
         consulta += " AND c.Apellido = %s"
         parametros.append(apellido)

        if fecha:
            anio, mes, dia = fecha.split("-")
            meses = [
                "January", "February", "March", "April",
                "May", "June", "July", "August",
                "September", "October", "November", "December"
            ]

            consulta += """
                AND r.Anio_llegada = %s
                AND r.Mes_llegada = %s
                AND r.Dia_llegada = %s
            """
            parametros.extend([int(anio), meses[int(mes) - 1], int(dia)])

        if estado == "cancelada":
            consulta += " AND r.Cancelado = 1"
        elif estado == "activa":
            consulta += " AND r.Cancelado = 0"

        consulta += " ORDER BY r.Anio_llegada DESC, r.Cod_reserva DESC LIMIT 100"

        with conexion.cursor() as cursor:
            cursor.execute(consulta, parametros)
            datos = cursor.fetchall()

        return jsonify(datos)

    finally:
        conexion.close()

@app.route("/hoteles")
def listar_hoteles():
    conexion=conectar()
    with conexion.cursor() as cursor:
        cursor.execute("SELECT cod_hotel, nombre FROM hotel")
        datos = cursor.fetchall()
    conexion.close()
    return jsonify(datos)

@app.route("/comidas")
def listar_comidas():
    conexion=conectar()
    with conexion.cursor() as cursor:
        cursor.execute("SELECT cod_comida, descrip FROM comida")
        datos = cursor.fetchall()
    conexion.close()
    return jsonify(datos)

@app.route("/segmentos")
def listar_segmetos():
    conexion=conectar()
    with conexion.cursor() as cursor:
        cursor.execute("SELECT cod_segme, descrip FROM segmento_mercado")
        datos = cursor.fetchall()
    conexion.close()
    return jsonify(datos)

@app.route("/canales")
def listar_canales():
    conexion=conectar()
    with conexion.cursor() as cursor:
        cursor.execute("SELECT cod_canal, descrip FROM canal_distribucion")
        datos = cursor.fetchall()
    conexion.close()
    return jsonify(datos)

@app.route("/depositos")
def listar_depositos():
    conexion=conectar()
    with conexion.cursor() as cursor:
        cursor.execute("SELECT cod_deposito, descrip FROM tipo_deposito")
        datos = cursor.fetchall()
    conexion.close()
    return jsonify(datos)

@app.route("/tipo-habitaciones")
def listar_tipohabitaciones():
    conexion=conectar()
    with conexion.cursor() as cursor:
        cursor.execute("SELECT cod_habitacion, descrip FROM tipo_habitacion")
        datos = cursor.fetchall()
    conexion.close()
    return jsonify(datos)

@app.route("/estados")
def listar_estados():
    conexion=conectar()
    with conexion.cursor() as cursor:
        cursor.execute("SELECT cod_estado, descrip FROM estado_reserva")
        datos = cursor.fetchall()
    conexion.close()
    return jsonify(datos)

@app.route("/tipo-clientes")
def listar_tipoclientes():
    conexion=conectar()
    with conexion.cursor() as cursor:
        cursor.execute("SELECT cod_tipocliente, descrip FROM tipo_cliente")
        datos = cursor.fetchall()
    conexion.close()
    return jsonify(datos)

@app.route("/clientes")
def listar_clientes():
    conexion = conectar()

    try:
        nombre = request.args.get("nombre", "").strip()
        apellido = request.args.get("apellido", "").strip()

        consulta = """
            SELECT cod_cliente, nombre, apellido, num_tel, email
            FROM cliente
        """

        condiciones = []
        parametros = []

        if nombre:
            condiciones.append("nombre = %s")
            parametros.append(nombre)

        if apellido:
            condiciones.append("apellido = %s")
            parametros.append(apellido)

        if condiciones:
            consulta += " WHERE " + " AND ".join(condiciones)
        else:
            consulta += " LIMIT 30"

        with conexion.cursor() as cursor:
            cursor.execute(consulta, parametros)
            datos = cursor.fetchall()

        return jsonify(datos)

    finally:
        conexion.close()

# consultas complicadas ay que miedo

# LISTADO PARA CALENDARIO: Llama a las fechas para la elaborcion del calendario

@app.route("/calendario")
def listar_calendario():
    conexion = conectar()
    with conexion.cursor() as cursor:
        cursor.execute("""
            SELECT re.cod_reserva, re.anio_llegada, re.mes_llegada, re.dia_llegada,
                   re.noche_finde, re.noche_semana, re.cancelado,
                   ho.nombre AS hotel,
                   cli.nombre, cli.apellido
            FROM reserva re
            JOIN hotel ho ON re.rsv_hotel = ho.cod_hotel
            JOIN cliente cli ON re.rsv_cliente = cli.cod_cliente
            LIMIT 20
        """)
        datos = cursor.fetchall()
    conexion.close()
    return jsonify(datos)

# BUSCAR POR NOMBRE/APELLIDO: muestra todos los resultados con ese nombre (completo o que lo contenga)
# ejemplo de uso: http://127.0.0.1:5000/buscar/nombre?nombre=Ana

@app.route("/buscar/nombre")
def buscar_clienombre():
    nombre = request.args.get("nombre", "")
    patron = f"{nombre}%"
    conexion = conectar()
    with conexion.cursor() as cursor:
        cursor.execute("""
            SELECT re.cod_reserva, re.anio_llegada, re.mes_llegada, re.dia_llegada,
                   re.noche_finde, re.noche_semana, re.cancelado,
                   ho.nombre AS hotel,
                   cli.nombre, cli.apellido
            FROM reserva re
            JOIN hotel ho ON re.rsv_hotel = ho.cod_hotel
            JOIN cliente cli ON re.rsv_cliente = cli.cod_cliente
            WHERE cli.nombre LIKE %s OR cli.apellido LIKE %s
            LIMIT 50
        """, (patron, patron))
        datos = cursor.fetchall()
    conexion.close()
    return jsonify(datos)

# RESERVA DE HABITACIONES: muestra las habitaciones y comidas.

@app.route("/habitaciones")
def listar_habitaciones():
    conexion = conectar()
    with conexion.cursor() as cursor:
        cursor.execute("""
        SELECT re.cod_reserva,
                hr.descrip AS habitacion_reservada,
                ha.descrip AS habitacion_asignada,
                c.descrip AS comida
            FROM reserva re
            JOIN tipo_habitacion hr ON re.rsv_hab_r = hr.cod_habitacion
            JOIN tipo_habitacion ha ON re.rsv_hab_a = ha.cod_habitacion
            JOIN comida c ON re.rsv_comida = c.cod_comida
            LIMIT 20 """)
        datos = cursor.fetchall()
    conexion.close()
    return jsonify (datos)

# HOTEL MAS POPULAR: compara las reservas entre hoteles para determinar cual es el mas popular.

@app.route("/estadisticas/hoteles")
def listar_hotestadisticas():
    conexion = conectar()
    with conexion.cursor() as cursor:
        cursor.execute("""
                SELECT ho.nombre AS hotel, COUNT(*) AS total
                    FROM reserva re
                    JOIN hotel ho ON re.rsv_hotel = ho.cod_hotel
                    GROUP BY ho.nombre
                    ORDER BY total DESC """)
        datos = cursor.fetchall()
    conexion.close()
    return jsonify (datos)

#PAIS MAS FRECUENTE: Determina el pais del que vienen mas huespedes

@app.route("/estadisticas/paises")
def listar_paisestadisticas():
    conexion = conectar()
    with conexion.cursor() as cursor:
        cursor.execute("""
                SELECT p.descrip AS pais, COUNT(*) AS total
                FROM reserva re
                JOIN cliente cli ON re.rsv_cliente = cli.cod_cliente
                JOIN pais p ON cli.c_pais = p.cod_pais
                GROUP BY p.descrip
                ORDER BY total DESC
                LIMIT 10 """)
        datos = cursor.fetchall()
    conexion.close()
    return jsonify (datos)

# NOCHES DE FINES DE SEMANA Y NOCHES DE SEMANA: Calcula los hospedajes por noches de semana y findes.

@app.route("/estadisticas/noches")
def listar_nochestadisticas():
    conexion = conectar()
    with conexion.cursor() as cursor:
        cursor.execute("""
            SELECT CAST(SUM(noche_semana) AS UNSIGNED) AS noches_semana,
                   CAST(SUM(noche_finde) AS UNSIGNED) AS noches_finde
            FROM reserva
        """)
        datos = cursor.fetchall()
    conexion.close()
    return jsonify(datos)

#SEGMENTO MERCADO: Determina la cantidad de huespedes dentro de un segmento.

@app.route("/estadisticas/segmentos")
def listar_segestadisticas():
    conexion = conectar()
    with conexion.cursor() as cursor:
        cursor.execute("""
                SELECT sm.descrip AS segmento, COUNT(*) AS total
                FROM reserva re
                JOIN segmento_mercado sm ON re.rsv_segme = sm.cod_segme
                GROUP BY sm.descrip
                ORDER BY total DESC """)
        datos = cursor.fetchall()
    conexion.close()
    return jsonify (datos)

#HABITACION MAS RESERVADA: .. y eso

@app.route("/estadisticas/habitaciones")
def listar_hbestadisticas():
    conexion = conectar()
    with conexion.cursor() as cursor:
        cursor.execute("""
            SELECT th.descrip AS habitacion, COUNT(*) AS total
            FROM reserva re
            JOIN tipo_habitacion th ON re.rsv_hab_r = th.cod_habitacion
            GROUP BY th.descrip
            ORDER BY total DESC""")
        datos = cursor.fetchall()
    conexion.close()
    return jsonify (datos)

# COMIDA MAS ELEGIDA: Que comida es mas popular entre los huespedes?

@app.route("/estadisticas/comida")
def listar_comiestadisticas():
    conexion = conectar()
    with conexion.cursor() as cursor:
        cursor.execute("""
            SELECT c.descrip AS comida, COUNT(*) AS total
            FROM reserva re
            JOIN comida c ON re.rsv_comida = c.cod_comida
            GROUP BY c.descrip
            ORDER BY total DESC """)
        datos = cursor.fetchall()
    conexion.close()
    return jsonify (datos)

#CUMPLIO HABITACIONES: Muestra un total de las habitaciones que se reservaro y
# las habitaciones que les asigno el hotel.


@app.route("/estadisticas/cumplio-habitaciones")
def listar_cumpliohabestadisticas():
    conexion = conectar()
    with conexion.cursor() as cursor:
        cursor.execute("""
            SELECT CASE WHEN rsv_hab_r = rsv_hab_a THEN 'Misma habitacion'
                        ELSE 'Habitacion distinta' END AS resultado,
                COUNT(*) AS total
            FROM reserva
            GROUP BY resultado
            ORDER BY total DESC""")
        datos = cursor.fetchall()
    conexion.close()
    return jsonify (datos)

# COMPARAR HABITACIONES: Compara las reservas y asignaciones que tuvo cada tipo de habitacion.

@app.route("/estadisticas/comparar-habitaciones")
def listar_compahabestadisticas():
    conexion = conectar()
    with conexion.cursor() as cursor:
        cursor.execute("""
            SELECT th.descrip AS habitacion,
                (SELECT COUNT(*) FROM reserva WHERE rsv_hab_r = th.cod_habitacion) AS reservadas,
                (SELECT COUNT(*) FROM reserva WHERE rsv_hab_a = th.cod_habitacion) AS asignadas
            FROM tipo_habitacion th
            ORDER BY th.descrip""")
        datos = cursor.fetchall()
    conexion.close()
    return jsonify (datos)

# Estadísticas de reservas por día de la semana
@app.route("/estadisticas/dias")
def estadisticas_dias():
    conexion = conectar()

    try:
        with conexion.cursor() as cursor:
            sql = """
                SELECT
                    CASE DAYOFWEEK(
                        STR_TO_DATE(
                            CONCAT(
                                Anio_llegada, '-',
                                Mes_llegada, '-',
                                Dia_llegada
                            ),
                            '%Y-%M-%d'
                        )
                    )
                        WHEN 2 THEN 'Lunes'
                        WHEN 3 THEN 'Martes'
                        WHEN 4 THEN 'Miercoles'
                        WHEN 5 THEN 'Jueves'
                        WHEN 6 THEN 'Viernes'
                        WHEN 7 THEN 'Sabado'
                        WHEN 1 THEN 'Domingo'
                    END AS dia,
                    COUNT(*) AS total
                FROM reserva
                GROUP BY DAYOFWEEK(
                    STR_TO_DATE(
                        CONCAT(
                            Anio_llegada, '-',
                            Mes_llegada, '-',
                            Dia_llegada
                        ),
                        '%Y-%M-%d'
                    )
                )
                ORDER BY DAYOFWEEK(
                    STR_TO_DATE(
                        CONCAT(
                            Anio_llegada, '-',
                            Mes_llegada, '-',
                            Dia_llegada
                        ),
                        '%Y-%M-%d'
                    )
                )
            """

            cursor.execute(sql)
            datos = cursor.fetchall()

        return jsonify(datos)

    finally:
        conexion.close()


# Estadísticas de reservas canceladas y no canceladas
@app.route("/estadisticas/cancelaciones")
def estadisticas_cancelaciones():
    conexion = conectar()

    try:
        with conexion.cursor() as cursor:
            sql = """
                SELECT
                    CASE
                        WHEN Cancelado = 1 THEN 'Canceladas'
                        ELSE 'No canceladas'
                    END AS estado,
                    COUNT(*) AS total
                FROM reserva
                GROUP BY
                    CASE
                        WHEN Cancelado = 1 THEN 'Canceladas'
                        ELSE 'No canceladas'
                    END
            """

            cursor.execute(sql)
            datos = cursor.fetchall()

        return jsonify(datos)

    finally:
        conexion.close()

# BUSCAR HOTEL: Permite buscar el hotel por nombre y ver sus reservaciones

@app.route("/buscar/hotel")
def buscar_nombrehotel():
    nombre = request.args.get("nombre", "")
    conexion = conectar()
    with conexion.cursor() as cursor:
        cursor.execute("""
            SELECT re.cod_reserva, re.anio_llegada, re.mes_llegada, re.dia_llegada,
                   re.noche_finde, re.noche_semana, re.cancelado,
                   ho.nombre AS hotel,
                   cli.nombre, cli.apellido
            FROM reserva re
            JOIN hotel ho ON re.rsv_hotel = ho.cod_hotel
            JOIN cliente cli ON re.rsv_cliente = cli.cod_cliente
            WHERE ho.nombre = %s
            LIMIT 50 """, (nombre,))
        datos = cursor.fetchall()
    conexion.close()
    return jsonify(datos)


# BUSCAR POR FECHA: muestra las reservas que llegan en determinada fecha
# ejemplo de uso: http://127.0.0.1:5000/buscar/fecha?fecha=2015-07-01

@app.route("/buscar/fecha")
def buscar_fecha():
    fecha = request.args.get("fecha", "")
    conexion = conectar()
    with conexion.cursor() as cursor:
        cursor.execute("""
            SELECT re.cod_reserva, re.anio_llegada, re.mes_llegada, re.dia_llegada,
                   DATE_FORMAT(STR_TO_DATE(CONCAT(re.anio_llegada, '-', re.mes_llegada, '-', re.dia_llegada), '%%Y-%%M-%%d'), '%%Y-%%m-%%d') AS fecha,
                   re.noche_finde, re.noche_semana, re.cancelado,
                   ho.nombre AS hotel,
                   cli.nombre, cli.apellido
            FROM reserva re
            JOIN hotel ho ON re.rsv_hotel = ho.cod_hotel
            JOIN cliente cli ON re.rsv_cliente = cli.cod_cliente
            WHERE STR_TO_DATE(CONCAT(re.anio_llegada, '-', re.mes_llegada, '-', re.dia_llegada), '%%Y-%%M-%%d') = %s
            LIMIT 100
        """, (fecha,))
        datos = cursor.fetchall()
    conexion.close()
    return jsonify(datos)

# RANGO DE FECHAS: Muestra las reservas que llegan entre fechas (se incluyen las fechas buscadas)
# ejemplo de uso: http://127.0.0.1:5000/buscar/rango?desde=2015-07-01&hasta=2015-07-07

@app.route("/buscar/rango")
def buscar_rango():
    desde = request.args.get("desde", "")
    hasta = request.args.get("hasta", "")
    conexion = conectar()
    with conexion.cursor() as cursor:
        cursor.execute("""
            SELECT re.cod_reserva, re.anio_llegada, re.mes_llegada, re.dia_llegada,
                   DATE_FORMAT(STR_TO_DATE(CONCAT(re.anio_llegada, '-', re.mes_llegada, '-', re.dia_llegada), '%%Y-%%M-%%d'), '%%Y-%%m-%%d') AS fecha,
                   re.noche_finde, re.noche_semana, re.cancelado,
                   ho.nombre AS hotel,
                   cli.nombre, cli.apellido
            FROM reserva re
            JOIN hotel ho ON re.rsv_hotel = ho.cod_hotel
            JOIN cliente cli ON re.rsv_cliente = cli.cod_cliente
            WHERE STR_TO_DATE(CONCAT(re.anio_llegada, '-', re.mes_llegada, '-', re.dia_llegada), '%%Y-%%M-%%d')
                  BETWEEN %s AND %s
            ORDER BY fecha
            LIMIT 100
        """, (desde, hasta))
        datos = cursor.fetchall()
    conexion.close()
    return jsonify(datos)


#  se busca por letra y devuelve la habitacion asignada o reservada.


@app.route("/buscar/habitacion")
def buscar_habitacion():
    tipo = request.args.get("tipo", "")
    conexion = conectar()
    with conexion.cursor() as cursor:
        cursor.execute("""
            SELECT re.cod_reserva, re.anio_llegada, re.mes_llegada, re.dia_llegada,
                   hr.descrip AS habitacion_reservada,
                   ha.descrip AS habitacion_asignada,
                   ho.nombre AS hotel,
                   cli.nombre, cli.apellido
            FROM reserva re
            JOIN hotel ho ON re.rsv_hotel = ho.cod_hotel
            JOIN cliente cli ON re.rsv_cliente = cli.cod_cliente
            JOIN tipo_habitacion hr ON re.rsv_hab_r = hr.cod_habitacion
            JOIN tipo_habitacion ha ON re.rsv_hab_a = ha.cod_habitacion
            WHERE hr.descrip = %s OR ha.descrip = %s
            LIMIT 100
        """, (tipo, tipo))
        datos = cursor.fetchall()
    conexion.close()
    return jsonify(datos)

        # Cancel por hotel
@app.route("/listados/cancelaciones-hotel")
def listado_cancelaciones_hotel():
    conexion = conectar()
    try:
        with conexion.cursor() as cursor:
            cursor.execute("""
                SELECT hotel, total_canceladas
                FROM vista_cancelaciones_hotel
                ORDER BY total_canceladas DESC
            """)
            datos = cursor.fetchall()
        return jsonify(datos)
    finally:
        conexion.close()


# Estadías de cinco noches o más
@app.route("/listados/estadias-largas")
def listado_estadias_largas():
    conexion = conectar()
    try:
        with conexion.cursor() as cursor:
            cursor.execute("""
                SELECT cod_reserva, mes_llegada, anio_llegada,
                       noche_finde, noche_semana, total_noches
                FROM vista_estadias_largas
                ORDER BY total_noches DESC
            """)
            datos = cursor.fetchall()
        return jsonify(datos)
    finally:
        conexion.close()


@app.route("/listados/reservas-mes")
def listado_reservas_mes():
    conexion = conectar()
    try:
        with conexion.cursor() as cursor:
            cursor.execute("""
                SELECT anio_llegada, mes_llegada, cantidad_reservas
                FROM vista_reservas_por_mes
                ORDER BY anio_llegada, mes_llegada
            """)
            datos = cursor.fetchall()
        return jsonify(datos)
    finally:
        conexion.close()


@app.route("/listados/adr-alto")
def listado_adr_alto():
    conexion = conectar()
    try:
        with conexion.cursor() as cursor:
            cursor.execute("""
                SELECT cod_reserva, adr, adultos, ninios,
                       mes_llegada, anio_llegada
                FROM vista_reservas_adr_alto
                ORDER BY adr DESC
            """)
            datos = cursor.fetchall()
        return jsonify(datos)
    finally:
        conexion.close()


@app.route("/listados/rango-fechas")
def rango_fechas_listados():
    conexion = conectar()

    try:
        with conexion.cursor() as cursor:
            cursor.execute("""
                SELECT
                    MIN(
                        STR_TO_DATE(
                            CONCAT(
                                Anio_llegada, '-',
                                Mes_llegada, '-',
                                Dia_llegada
                            ),
                            '%Y-%M-%d'
                        )
                    ) AS fecha_minima,
                    MAX(
                        STR_TO_DATE(
                            CONCAT(
                                Anio_llegada, '-',
                                Mes_llegada, '-',
                                Dia_llegada
                            ),
                            '%Y-%M-%d'
                        )
                    ) AS fecha_maxima
                FROM reserva
            """)

            datos = cursor.fetchone()

        if not datos or not datos["fecha_minima"]:
            return jsonify({
                "fecha_minima": None,
                "fecha_maxima": None
            })

        return jsonify({
            "fecha_minima": datos["fecha_minima"].strftime("%Y-%m-%d"),
            "fecha_maxima": datos["fecha_maxima"].strftime("%Y-%m-%d")
        })

    finally:
        conexion.close()

@app.route("/inicio/resumen")
def inicio_resumen():
    conexion = conectar()

    try:
        with conexion.cursor() as cursor:
            cursor.execute("SELECT COUNT(*) AS total FROM reserva")
            total_reservas = cursor.fetchone()["total"]

            cursor.execute("SELECT COUNT(*) AS total FROM cliente")
            total_clientes = cursor.fetchone()["total"]

        return jsonify({
            "total_reservas": total_reservas,
            "total_clientes": total_clientes
        })

    finally:
        conexion.close()


if __name__ == "__main__":
    app.run(debug=True)



