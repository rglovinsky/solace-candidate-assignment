import { SQL, sql } from 'drizzle-orm'
import {
  pgTable,
  integer,
  text,
  jsonb,
  serial,
  timestamp,
  bigint
} from 'drizzle-orm/pg-core'

export const advocates = pgTable('advocates', {
  id: serial('id').primaryKey(),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  city: text('city').notNull(),
  degree: text('degree').notNull(),
  specialties: jsonb('specialties').default([]).notNull(),
  yearsOfExperience: integer('years_of_experience').notNull(),
  phoneNumber: bigint('phone_number', { mode: 'number' }).notNull(),
  createdAt: timestamp('created_at').default(sql`CURRENT_TIMESTAMP`),
  searchTrigram: text('search_trigram')
    .notNull()
    .generatedAlwaysAs(
      (): SQL =>
        sql`${advocates.firstName}
          || ' ' || ${advocates.lastName}
          || ' ' || ${advocates.city}
          || ' ' || ${advocates.degree}
          || ' ' || ${advocates.specialties}::text
          || ' ' || ${advocates.yearsOfExperience}::text
          || ' ' || ${advocates.phoneNumber}::text
        `
    )
})
