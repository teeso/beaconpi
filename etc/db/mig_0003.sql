
create table models (
  id serial primary key,
  bias real not null,
  gamma real not null
);

insert into models (id, bias, gamma) values 
  (1, -50.25529076, 2.57321105);

alter table edge_node
  add model integer not null references models default 1;


