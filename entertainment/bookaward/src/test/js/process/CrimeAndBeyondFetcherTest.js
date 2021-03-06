define(["Award", "process/CrimeAndBeyondFetcher"], function(Award, CrimeAndBeyondFetcher)
{
    "use strict";
    QUnit.module("CrimeAndBeyondFetcher");

    QUnit.test("receiveData() Agatha", function(assert)
    {
        // Setup.
        var award = Award.properties[Award.CRIME_AND_BEYOND];
        var category = award.categories.properties[award.categories.CASE];
        var callback = function(books, bookToNomination)
        {
            assert.ok(books);
            assert.equal(books.length, 14);

            var i = 0;
            assert.equal(books[i].title(), "Blood On Snow");
            assert.equal(books[i].author(), "Jo Nesbø");
            var nominations = bookToNomination[books[i]];
            assert.ok(nominations);
            assert.equal(nominations.length, 1);
            var j = 0;
            assert.equal(nominations[j].award(), award);
            assert.equal(nominations[j].category(), category);
            assert.equal(nominations[j].year(), 2016);

            i = books.length - 1;
            assert.equal(books[i].title(), "Fool Me Once");
            assert.equal(books[i].author(), "Harlan Coben");
            nominations = bookToNomination[books[i]];
            assert.ok(nominations);
            assert.equal(nominations.length, 1);
            j = 0;
            assert.equal(nominations[j].award(), award);
            assert.equal(nominations[j].category(), category);
            assert.equal(nominations[j].year(), 2017);
        };
        var fetcher = new CrimeAndBeyondFetcher(callback);

        // Run.
        fetcher.receiveData();

        // Verify.
        assert.ok(true);
    });
});
