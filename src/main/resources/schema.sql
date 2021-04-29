create table if not exists sudoku_grid
(
    seq      int identity primary key,
    grid     char(81)               not null,
    created  datetime default now() not null,
    modified datetime               null
);

create table if not exists sudoku_score
(
    seq      int identity primary key,
    grid_seq int                    not null,
    name     varchar(30)            not null,
    cost     time                   not null,
    created  datetime default now() not null,
    modified datetime               null
);

alter table sudoku_score
    add foreign key (grid_seq) references sudoku_grid (seq) on delete cascade on update cascade;
