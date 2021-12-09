-- Make a database
CREATE table pastebindb (
    index serial primary key,
    input varchar(255)
)

--Get all the quotes (our input) from database
SELECT * FROM pastebindb

-- Add a quote to the database
INSERT INTO pastebindb (input) VALUES(<"Quote">)


