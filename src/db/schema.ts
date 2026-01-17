import { pgTable, serial, varchar, timestamp } from 'drizzle-orm/pg-core';

export const usuarios = pgTable('usuarios', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(),
  nombre: varchar('nombre', { length: 120 }).notNull(),
  rol: varchar('rol', { length: 50 }).notNull(),
  fecha_creacion: timestamp('fecha_creacion').defaultNow().notNull()
});
