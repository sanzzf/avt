namespace AudioVisualModule.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class changeEventmodel7 : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Events", "UserEmail", c => c.String());
        }
        
        public override void Down()
        {
            DropColumn("dbo.Events", "UserEmail");
        }
    }
}
