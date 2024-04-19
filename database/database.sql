create table users(
  "id" serial primary key,
  "type" text default 0 not null, --admin/users
  "fullname" text not null,
  "email" text not null,
  "image" text,
  "year" integer,
  "sinf" integer,
   UNIQUE(email)
  "password" text not null,
  "time_create" timestamp default current_timestamp not null,
  "time_update" timestamp default current_timestamp not null
);


create table game_user{
    "id" serial primary key,
    "user_id" integer not null,
    "result" integer not null,
    "time" integer not null,
    "game_number" integer not null,
    "game_title" text not null,
    "time_create" timestamp default current_timestamp not null,
    "time_update" timestamp default current_timestamp not null
} 