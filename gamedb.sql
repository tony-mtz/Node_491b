use gamedb;
	
create table if not exists `users` (		
    `userName` varchar(70) not null,
    `userPass` varchar(255) not null,
    primary key (`userName`)
    ) engine = InnoDB default charset=utf8;
    
insert into `users` (`userName`, `userPass`) values ('tony', 'tony');
insert into `users` (`userName`, `userPass`) values ('jess', 'jess');

create table if not exists `scores` (
	`userName` varchar(70) not null,
	`score`	int(10) not null,
    `stamp` timestamp not null default current_timestamp,
    primary key(username, stamp),
    foreign key(userName) references `users`(userName)
	
) engine = InnoDB default charset=utf8;



insert into `scores`(`userName`,`score`) values('tony', 100);

select * from users;
select * from scores;