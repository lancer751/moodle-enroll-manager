import { Prisma } from "../generated/prisma/client"
import { prisma } from "../src/config/connection"
import { faker } from '@faker-js/faker'

async function main() {
    console.log('🌱 Seeding database...')

    const vendedor = await prisma.role.upsert({
        where: { nombre: 'ventas' },
        update: {},
        create: { nombre: 'ventas', descripcion: 'Rol para vendedores' }
    })

    const admin = await prisma.role.upsert({
        where: { nombre: 'administrador' },
        update: {},
        create: { nombre: 'administrador', descripcion: 'Rol para administradores' }
    })

    const finanzas = await prisma.role.upsert({
        where: { nombre: 'finanzas' },
        update: {},
        create: { nombre: 'finanzas', descripcion: 'Rol para finanzas' }
    })

    const ventasRole = await prisma.role.findFirst({
        where: { nombre: 'ventas' }
    })

    // 🔹 USUARIOS (2 vendedores)
    const vendedores = []
    for (let i = 0; i < 2; i++) {
        const vendedor = await prisma.usuario.create({
            data: {
                nombre: faker.person.firstName(),
                apellido_materno: faker.person.lastName(),
                apellido_paterno: faker.person.lastName(),
                email: faker.internet.email(),
                password: 'hashedpassword',
                role_id: ventasRole!.id
            }
        })
        vendedores.push(vendedor)
    }

    // 🔹 5 CURSOS
    const cursos = []
    for (let i = 0; i < 5; i++) {
        const curso = await prisma.curso.create({
            data: {
                nombre: faker.company.catchPhrase(),
                descripcion: faker.lorem.sentence(),
                duracion_semanas: faker.number.int({ min: 4, max: 12 })
            }
        })
        cursos.push(curso)
    }

    // 🔹 MODALIDADES

    const virtual = await prisma.modalidad.upsert({
        where: { nombre: 'virtual' },
        update: {},
        create: { nombre: 'virtual' }
    })

    const presencial = await prisma.modalidad.upsert({
        where: { nombre: 'presencial' },
        update: {},
        create: { nombre: 'presencial' }
    })

    const hibrido = await prisma.modalidad.upsert({
        where: { nombre: 'híbrido' },
        update: {},
        create: { nombre: 'híbrido' }
    })

    const modalidadList = await prisma.modalidad.findMany()

    // 🔹 EDICIONES + PRODUCTOS
    const productos = []

    for (const curso of cursos) {
        const edicion = await prisma.edicion.create({
            data: {
                curso_id: curso.id,
                modalidad_id: faker.helpers.arrayElement(modalidadList).id,
                fecha_inicio: faker.date.future(),
                fecha_finalizacion: faker.date.future()
            }
        })

        const producto = await prisma.producto.create({
            data: {
                edicion_id: edicion.id,
                precio: new Prisma.Decimal(
                    faker.number.int({ min: 200, max: 800 })
                )
            }
        })

        productos.push(producto)
    }

    // 🔹 20 CLIENTES
    const clientes = []
    for (let i = 0; i < 20; i++) {
        const cliente = await prisma.cliente.create({
            data: {
                nombre: faker.person.firstName(),
                apellido_materno: faker.person.lastName(),
                apellido_paterno: faker.person.lastName(),
                email: faker.internet.email(),
                dni: faker.string.numeric(8)
            }
        })
        clientes.push(cliente)
    }

    // 🔹 10 COMPRAS con estados variados
    const estadosCompra = ['pendiente', 'pagado', 'cancelado', 'reembolsado'] as const
    const estadosPago = ['pendiente', 'confirmado', 'rechazado', 'reembolsado'] as const

    for (let i = 0; i < 10; i++) {
        const cliente = faker.helpers.arrayElement(clientes)
        const vendedor = faker.helpers.arrayElement(vendedores)
        const producto = faker.helpers.arrayElement(productos)

        const estadoCompra = faker.helpers.arrayElement(estadosCompra)
        const precio = producto.precio

        const compra = await prisma.compra.create({
            data: {
                cliente_id: cliente.id,
                vendedor_id: vendedor.id,
                costo_total: precio,
                estado_order: estadoCompra
            }
        })

        await prisma.detalleCompra.create({
            data: {
                producto_id: producto.id,
                compra_id: compra.id,
                costo_unitario: precio
            }
        })

        // Pago asociado
        const estadoPago = faker.helpers.arrayElement(estadosPago)

        await prisma.pago.create({
            data: {
                orden_id: compra.id,
                cantidad: precio,
                estado: estadoPago,
                metodo_pago: faker.helpers.arrayElement(['BCP', 'Yape', 'Transferencia']),
                fecha_pago:
                    estadoPago === 'confirmado'
                        ? faker.date.recent()
                        : null
            }
        })

        // Si pagado → matrícula activa
        if (estadoCompra === 'pagado') {
            await prisma.matricula.create({
                data: {
                    cliente_id: cliente.id,
                    curso_id: cursos[0].id,
                    estado: 'activo'
                }
            })
        }
    }

    console.log('🌱 Datos generados correctamente')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })