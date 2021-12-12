-- Make a database
CREATE table pastebindb (
    index serial primary key,
    input varchar(10000) not null
)

--Get all the quotes (our input) from database
SELECT * FROM pastebindb LIMIT 10 ORDER BY index desc

-- Add a quote to the database
INSERT INTO pastebindb (input) VALUES(<"Quote">)


